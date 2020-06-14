import { grpc } from "@improbable-eng/grpc-web"
import "webrtc-adapter"
import * as grtc from "../protos/grtc/grtc_pb"
import { WebRtcAbstractClient } from "./webrtcabstractclient"

export class WebRtcChannel {
	channel: RTCDataChannel
	sequence: number
	clients: Map<number, WebRtcAbstractClient>

	constructor(channel: RTCDataChannel) {
		this.channel = channel
		this.sequence = 0
		this.clients = new Map<number, WebRtcAbstractClient>()

		this.channel.onclose = this.onClose.bind(this)
		this.channel.onerror = this.onError.bind(this)
		this.channel.onmessage = this.onMessage.bind(this)
	}

	add(stream: WebRtcAbstractClient): grtc.Routing {
		const sequence = ++this.sequence
		this.clients.set(sequence, stream)

		const routing = new grtc.Routing()
		routing.setSequence(sequence)
		return routing
	}

	remove(stream: WebRtcAbstractClient) {
		this.clients.delete(stream.routing.getSequence())
	}

	send(request: grtc.Request) {
		console.info("request", request.toObject())
		const data = request.serializeBinary()
		this.channel.send(data)
	}

	onClose() {
		this.setError(grpc.Code.Unavailable, "Channel closed")
	}

	onError(ev: RTCErrorEvent) {
		const message = ev.error?.message ?? "Aborted"
		this.setError(grpc.Code.Aborted, message)
	}

	setError(statusCode: number, message: string) {
		this.clients.forEach(stream => {
			stream.onChannelError(statusCode, message)
		})
		this.clients.clear()
	}

	onMessage(ev: MessageEvent) {
		const response = grtc.Response.deserializeBinary(ev.data)

		const routing = response.getRouting()
		if (!routing) {
			console.error("missing routing on ", response)
			return
		}

		const sequence = routing.getSequence()
		const stream = this.clients.get(sequence)
		if (!stream) {
			console.error("missing stream for ", sequence)
			return
		}

		console.info("response", response.toObject())

		switch (response.getTypeCase()) {
			case grtc.Response.TypeCase.BEGIN:
				stream.onChannelBegin(response.getBegin()!)
				break
			case grtc.Response.TypeCase.DATA:
				stream.onChannelData(response.getData()!)
				break
			case grtc.Response.TypeCase.END:
				stream.onChannelEnd(response.getEnd()!)
				break
		}
	}
}
