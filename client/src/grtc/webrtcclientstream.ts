import { AbstractClientBase, ClientReadableStream, Error, Status, StatusCode } from "grpc-web"
import "webrtc-adapter"
import * as pb from "../protos/grtc/grtc_pb"
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

	// Callbacks for WebRtcClientBase
	handlerOnData: ((response: Response) => void) | null = null;
	handlerOnStatus: ((status: Status) => void) | null = null;
	handlerOnError: ((err: Error) => void) | null = null;
	handlerOnEnd: (() => void) | null = null;

	// Callbacks for user
	clientOnData: ((response: Response) => void) | null = null;
	clientOnStatus: ((status: Status) => void) | null = null;
	clientOnError: ((err: Error) => void) | null = null;
	clientOnEnd: (() => void) | null = null;

	on(type: "data", callback: (response: Response) => void): ClientReadableStream<Response>
	on(type: "status", callback: (status: Status) => void): ClientReadableStream<Response>
	on(type: "error", callback: (err: Error) => void): ClientReadableStream<Response>
	on(type: "end", callback: () => void): ClientReadableStream<Response>

	on(eventType: any, callback: any) {
		if (eventType === 'data') {
			this.clientOnData = callback
		} else if (eventType === 'status') {
			this.clientOnStatus = callback
		} else if (eventType === 'error') {
			this.clientOnError = callback
		} else if (eventType === 'end') {
			this.clientOnEnd = callback
		}
		return this
	}

	cancel() {
		this.sendEndStatus(StatusCode.CANCELLED, "Call cancelled")
		this.close()
	}

	onData(data: pb.Data) {
		const rawData = data.getData_asU8()
		const response = this.responseDeserializeFn(rawData)
		if (this.clientOnData) this.clientOnData(response)
		if (this.handlerOnData) this.handlerOnData(response)
	}

	onEnd(end: pb.End) {
		const status: Status = {
			code: StatusCode.OK,
			details: "",
		}

		const endStatus = end.getStatus()
		if (endStatus) {
			console.log(endStatus)
			status.code = endStatus.getCode()
			status.details = endStatus.getMessage()
		}

		if (this.clientOnStatus) this.clientOnStatus(status)
		if (this.handlerOnStatus) this.handlerOnStatus(status)

		if (this.clientOnEnd) this.clientOnEnd()
		if (this.handlerOnEnd) this.handlerOnEnd()
		this.close()
	}

	onError(statusCode: number, message: string) {
		const error = {
			code: statusCode,
			message: message,
		}
		if (this.clientOnError) this.clientOnError(error)
		if (this.handlerOnError) this.handlerOnError(error)
	}

	sendRequest(request: Request) {
		const data = new pb.Data()
		data.setData(this.requestSerializeFn(request))
		this.sendData(data)
	}
}
