import React, { Fragment, useState } from 'react'
import "webrtc-adapter"
import { EchoClient } from './echo'
import { WebRtcChannel } from './grtc/webrtcchannel'
import { EchoServiceClient } from './protos/echo/echo_pb_service'
import { OfferRequest } from './protos/signaling/signaling_pb'
import { SignalingServiceClient } from './protos/signaling/signaling_pb_service'

interface Connection {
	client: EchoServiceClient
	disconnect: () => void
}

export const App: React.FC = () => {
	const [messages, setMessages] = useState<string[]>([])
	const log = (...messages: string[]) => setMessages(value => [...value, ...messages, "\n"])
	const [connection, setConnection] = useState<Connection | null>(null)

	const connectGrpcWeb = async () => {
		const client = new EchoServiceClient("http://localhost:8080")
		const disconnect = () => { } // ??
		setConnection({ client, disconnect })
	}

	const connectWebRtc = async () => {
		try {
			const peer = new RTCPeerConnection()
			const dataChannel = peer.createDataChannel("grpc")
			const offer = await peer.createOffer()
			await peer.setLocalDescription(offer)

			const request = new OfferRequest()
			request.setSdp(offer.sdp!)
			//log(offer.sdp!)

			const signaling = new SignalingServiceClient("http://localhost:8080")
			signaling.offer(request, async (error, response) => {
				if (error) {
					log("signaling error: ", error.message)
					return
				}
				if (!response) {
					log("signaling error: empty response")
					return
				}

				await peer.setRemoteDescription({
					type: "answer",
					sdp: response.getSdp()
				})

				log("connected")
				const channel = new WebRtcChannel(dataChannel)
				//@ts-ignore
				const client = new EchoServiceClient(channel)

				const disconnect = () => {
					log("disconnect")
					peer.close()
				}
				setConnection({ client, disconnect })

				// data channel doesn't seem to detect lost connection by itself
				peer.oniceconnectionstatechange = () => {
					if (peer.iceConnectionState !== "connected") {
						log("disconnected")
						disconnect()
					}
				}
			})
		}
		catch (e) {
			log("connect failed: ", e.message)
		}
	}

	const disconnect = () => {
		connection?.disconnect()
		setConnection(null)
	}

	return (<>
		<h1>
			gRPC over WebRTC demo / Improbable
		</h1>
		<p>
			{connection
				? <button onClick={disconnect}>Disconnect</button>
				: <>
					<button onClick={connectGrpcWeb}>Connect with GrpcWeb</button>
					<button onClick={connectWebRtc}>Connect with WebRTC</button>
				</>}
		</p>
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			<div style={{ marginRight: "4em" }}>
				<h3>
					Messages
				</h3>
				<pre>
					{messages.map((message, index) => (
						<Fragment key={index}>
							{message}
						</Fragment>))}
				</pre>
				<button onClick={() => setMessages([])}>Clear</button>
			</div>
			<div>
				{connection && <EchoClient client={connection.client} log={log} />}
			</div>
		</div>
	</>)
}
