import { Metadata, StatusCode } from "grpc-web"
import "webrtc-adapter"
import { Status } from "./protos/google/rpc/status_pb"
import * as grtc from "./protos/grtc/grtc_pb"
import { WebRtcChannel } from "./webrtcchannel"

export abstract class WebRtcAbstractStream {

	constructor(
		channel: WebRtcChannel) {
		this.channel = channel
		this.routing = channel.register(this)
	}

	channel: WebRtcChannel
	routing: grtc.Routing

	close() {
		this.channel.remove(this)
	}

	sendCall(method: string, metadata: Metadata) {
		const call = new grtc.Call()
		call.setMethod(method)

		const request = new grtc.Request()
		request.setRouting(this.routing)
		request.setCall(call)
		this.channel.send(request)
	}

	sendData(data: grtc.Data) {
		const request = new grtc.Request()
		request.setRouting(this.routing)
		request.setData(data)
		this.channel.send(request)
	}

	sendEnd(end: grtc.End) {
		const request = new grtc.Request()
		request.setRouting(this.routing)
		request.setEnd(end)
		this.channel.send(request)
	}

	sendEndStatus(statusCode = StatusCode.OK, message: string = "OK") {
		const status = new Status()
		status.setCode(statusCode)
		status.setMessage(message)
		const end = new grtc.End()
		end.setStatus(status)
		this.sendEnd(end)
	}

	abstract onData(data: grtc.Data): void
	abstract onEnd(end: grtc.End): void
	abstract onError(statusCode: number, message: string): void
}
