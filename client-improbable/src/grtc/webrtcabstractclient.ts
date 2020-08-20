import { grpc } from "@improbable-eng/grpc-web"
import "webrtc-adapter"
import * as pbs from "../protos/google/rpc/status_pb"
import * as grtc from "../protos/grtc/grtc_pb"
import { WebRtcChannel } from "./webrtcchannel"

export abstract class WebRtcAbstractClient {
	channel: WebRtcChannel
	routing: grtc.Routing

	constructor(channel: WebRtcChannel) {
		this.channel = channel
		this.routing = channel.add(this)
	}

	done() {
		this.channel.remove(this)
	}

	sendCall(method: string, metadata?: grtc.Metadata) {
		const call = new grtc.Call()
		call.setMethod(method)
		call.setMetadata(metadata)
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

	sendEndStatus(code = grpc.Code.OK, message: string = "") {
		const end = new grtc.End()
		if (code !== grpc.Code.OK) {
			const status = new pbs.Status()
			status.setCode(code)
			status.setMessage(message)
			end.setStatus(status)
		}
		this.sendEnd(end)
	}

	abstract onChannelBegin(begin: grtc.Begin): void
	abstract onChannelData(data: grtc.Data): void
	abstract onChannelEnd(end: grtc.End): void
	abstract onChannelError(statusCode: number, message: string): void
}
