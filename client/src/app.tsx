import React, { Fragment, useState } from 'react'
import "webrtc-adapter"
import { EchoClient } from './echo'
import { SignalingServicePromiseClient } from './protos/api/signaling_grpc_web_pb'
import { OfferRequest } from './protos/api/signaling_pb'
import { WebRtcChannel } from './webrtcchannel'

export const App: React.FC = () => {
	const [messages, setMessages] = useState<string[]>([])
	const log = (...messages: string[]) => setMessages(value => [...value, ...messages, "\n"])
	const [channel, setChannel] = useState<WebRtcChannel | null>(null)
	const [peer, setPeer] = useState<RTCPeerConnection | null>(null)

	const connect = async () => {
		try {
			const peer = new RTCPeerConnection()
			const dataChannel = peer.createDataChannel("grpc")
			const offer = await peer.createOffer()
			await peer.setLocalDescription(offer)

			const request = new OfferRequest()
			request.setSdp(offer.sdp!)
			//log(offer.sdp!)

			const client = new SignalingServicePromiseClient("http://localhost:8080")
			const response = await client.offer(request)
			//log(response.getSdp())

			await peer.setRemoteDescription({
				type: "answer",
				sdp: response.getSdp()
			})

			const channel = new WebRtcChannel(dataChannel)
			log("connected")
			setChannel(channel)
			setPeer(peer)

			// data channel doesn't seem to detect lost connection by itself
			peer.oniceconnectionstatechange = () => {
				if (peer.iceConnectionState !== "connected") {
					log("disconnected")
					disconnect(peer)
				}
			}
		}
		catch (e) {
			log("connect failed: ", e.message)
		}
	}

	const disconnect = (peer: RTCPeerConnection) => {
		log("disconnect")
		peer.close()
		setChannel(null)
		setPeer(null)
	}

	return (<>
		<h1>
			gRPC over WebRTC demo
		</h1>
		<p>
			{peer
				? <button onClick={() => disconnect(peer)}>Disconnect</button>
				: <button onClick={connect}>Connect</button>}
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
				<button onClick={() => setMessages([])}>clear</button>
			</div>
			<div>
				{channel && <EchoClient channel={channel} log={log} />}
			</div>
		</div>
	</>)
}
