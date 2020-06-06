import { AbstractClientBase, ClientReadableStream, Error, Status, StatusCode } from "grpc-web"
import "webrtc-adapter"
import * as grtc from "../protos/grtc/grtc_pb"
import { WebRtcAbstractStream } from "./webrtcabstractstream"
import { WebRtcChannel } from "./webrtcchannel"

export class WebRtcClientStream<Request, Response>
	extends WebRtcAbstractStream
	implements ClientReadableStream<Response> {

	constructor(
		channel: WebRtcChannel,
		methodInfo: AbstractClientBase.MethodInfo<Request, Response>) {
		super(channel)

		// grpc-web, please expose those fields :)
		//@ts-ignore
		this.requestSerializeFn = methodInfo.a
		//@ts-ignore
		this.responseDeserializeFn = methodInfo.b
	}

	requestSerializeFn: (request: Request) => Uint8Array
	responseDeserializeFn: (bytes: Uint8Array) => Response

	ondata: ((response: Response) => void) | null = null;
	onstatus: ((status: Status) => void) | null = null;
	onerror: ((err: Error) => void) | null = null;
	onend: (() => void) | null = null;

	on(type: "data", callback: (response: Response) => void): ClientReadableStream<Response>
	on(type: "status", callback: (status: Status) => void): ClientReadableStream<Response>
	on(type: "error", callback: (err: Error) => void): ClientReadableStream<Response>
	on(type: "end", callback: () => void): ClientReadableStream<Response>

	on(eventType: any, callback: any) {
		if (eventType === 'data') {
			this.ondata = callback
		} else if (eventType === 'status') {
			this.onstatus = callback
		} else if (eventType === 'error') {
			this.onerror = callback
		} else if (eventType === 'end') {
			this.onend = callback
		}
		return this
	}

	cancel() {
		this.sendEndStatus(StatusCode.CANCELLED, "Call cancelled")
		this.close()
	}

	onData(data: grtc.Data) {
		const rawData = data.getData_asU8()
		const response = this.responseDeserializeFn(rawData)
		if (this.ondata) this.ondata(response)
	}

	onEnd(end: grtc.End) {
		const status: Status = {
			code: StatusCode.OK,
			details: "",
		}

		const endStatus = end.getStatus()
		if (endStatus) {
			status.code = endStatus.getCode()
			status.details = endStatus.getMessage()
		}

		const metadata = end.getTrailer()
		if (metadata) {
			// grpc-web uses map<string, string>
			// but grpc-go uses map<string, []string>
			status.metadata = {}
			metadata.getMdMap().forEach((entry, key) =>
				entry.getValuesList().forEach(value => {
					status.metadata![key] = value
				})
			)
		}

		if (status.code === StatusCode.OK) {
			if (this.onstatus) this.onstatus(status)
			if (this.onend) this.onend()
		} else {
			if (this.onerror) this.onerror({
				code: status.code,
				message: status.details,
				//@ts-ignore (type missing)
				metadata: status.metadata,
			})
		}

		this.close()
	}

	onError(statusCode: number, message: string) {
		const error = {
			code: statusCode,
			message: message,
		}
		if (this.onerror) this.onerror(error)
	}

	sendRequest(request: Request) {
		const data = new grtc.Data()
		data.setData(this.requestSerializeFn(request))
		this.sendData(data)
	}
}
