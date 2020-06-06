import React, { Fragment, useState } from 'react'
import "webrtc-adapter"
import { EchoClient } from './echo'
import { adapter } from './grtc/adapter'
import { WebRtcChannel } from './grtc/webrtcchannel'
import { EchoServicePromiseClient } from './protos/echo/echo_grpc_web_pb'
import { SignalingServicePromiseClient } from './protos/signaling/signaling_grpc_web_pb'
import { OfferRequest } from './protos/signaling/signaling_pb'

interface Connection {
	client: EchoServicePromiseClient
	disconnect: () => void
}

export const App: React.FC = () => {
	const [messages, setMessages] = useState<string[]>([])
	const log = (...messages: string[]) => setMessages(value => [...value, ...messages, "\n"])
	const [connection, setConnection] = useState<Connection | null>(null)

	const connectGrpcWeb = async () => {
		const client = new EchoServicePromiseClient("http://localhost:8080")
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

			const signaling = new SignalingServicePromiseClient("http://localhost:8080")
			const response = await signaling.offer(request)
			//log(response.getSdp())

			await peer.setRemoteDescription({
				type: "answer",
				sdp: response.getSdp()
			})

			log("connected")
			const channel = new WebRtcChannel(dataChannel)
			const client = adapter(channel, new EchoServicePromiseClient(""))
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
			gRPC over WebRTC demo
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
