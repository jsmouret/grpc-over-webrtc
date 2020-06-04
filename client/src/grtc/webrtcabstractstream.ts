import { Metadata, StatusCode } from "grpc-web"
import "webrtc-adapter"
import { Status } from "../protos/google/rpc/status_pb"
import * as pb from "../protos/grtc/grtc_pb"
import { WebRtcChannel } from "./webrtcchannel"

export abstract class WebRtcAbstractStream {

	constructor(
		channel: WebRtcChannel) {
		this.channel = channel
		this.routing = channel.register(this)
	}

	channel: WebRtcChannel
	routing: pb.Routing

	close() {
		this.channel.remove(this)
	}

	sendCall(method: string, metadata: Metadata) {
		const call = new pb.Call()
		call.setMethod(method)

		const request = new pb.Request()
		request.setRouting(this.routing)
		request.setCall(call)
		this.channel.send(request)
	}

	sendData(data: pb.Data) {
		const request = new pb.Request()
		request.setRouting(this.routing)
		request.setData(data)
		this.channel.send(request)
	}

	sendEnd(end: pb.End) {
		const request = new pb.Request()
		request.setRouting(this.routing)
		request.setEnd(end)
		this.channel.send(request)
	}

	sendEndStatus(statusCode = StatusCode.OK, message: string = "OK") {
		const status = new Status()
		status.setCode(statusCode)
		status.setMessage(message)
		const end = new pb.End()
		end.setStatus(status)
		this.sendEnd(end)
	}

	abstract onData(data: pb.Data): void
	abstract onEnd(end: pb.End): void
	abstract onError(statusCode: number, message: string): void
}
