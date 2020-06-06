import { StatusCode } from "grpc-web"
import "webrtc-adapter"
import * as pb from "../protos/grtc/grtc_pb"
import { WebRtcAbstractStream } from "./webrtcabstractstream"

export class WebRtcChannel {
	channel: RTCDataChannel
	sequence: number
	streams: Map<number, WebRtcAbstractStream>

	constructor(channel: RTCDataChannel) {
		this.channel = channel
		this.sequence = 0
		this.streams = new Map<number, WebRtcAbstractStream>()

		this.channel.onmessage = this.onMessage.bind(this)
		this.channel.onclose = this.onClose.bind(this)
		this.channel.onerror = this.onError.bind(this)
	}

	onClose() {
		this.setError(StatusCode.UNAVAILABLE, "Channel closed")
	}

	register(stream: WebRtcAbstractStream): pb.Routing {
		const sequence = ++this.sequence
		this.streams.set(sequence, stream)

		const routing = new pb.Routing()
		routing.setSequence(sequence)
		return routing
	}

	remove(stream: WebRtcAbstractStream) {
		this.streams.delete(stream.routing.getSequence())
	}

	send(request: pb.Request) {
		const data = request.serializeBinary()
		this.channel.send(data)
	}

	onError(ev: RTCErrorEvent) {
		const message = ev.error?.message ?? "Aborted"
		this.setError(StatusCode.ABORTED, message)
	}

	setError(statusCode: number, message: string) {
		this.streams.forEach(stream => {
			stream.onError(statusCode, message)
		})
		this.streams.clear()
	}

	onMessage(ev: MessageEvent) {
		const response = pb.Response.deserializeBinary(ev.data)

		const routing = response.getRouting()
		if (!routing) {
			console.log("missing routing on ", response)
			return
		}

		const sequence = routing.getSequence()
		const stream = this.streams.get(sequence)
		if (!stream) {
			console.log("missing stream for ", sequence)
			return
		}

		switch (response.getTypeCase()) {
			case pb.Response.TypeCase.BEGIN:
				// TODO: on('begin') maybe?
				break
			case pb.Response.TypeCase.DATA:
				stream.onData(response.getData()!)
				break
			case pb.Response.TypeCase.END:
				stream.onEnd(response.getEnd()!)
				break
		}
	}
}
