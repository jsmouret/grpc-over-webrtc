import { AbstractClientBase, ClientReadableStream, Error, Metadata } from "grpc-web"
import "webrtc-adapter"
import { WebRtcChannel } from "./webrtcchannel"
import { WebRtcClientStream } from "./webrtcclientstream"

export class WebRtcClientBase implements AbstractClientBase {
	channel: WebRtcChannel

	constructor(channel: WebRtcChannel) {
		this.channel = channel
	}

	unaryCall<Request, Response>(
		method: string,
		request: Request,
		metadata: Metadata,
		methodInfo: AbstractClientBase.MethodInfo<Request, Response>)
		: Promise<Response> {

		const stream = new WebRtcClientStream<Request, Response>(this.channel, methodInfo)

		let doResolve: (reponse: Response) => void
		let doReject: (reason: any) => void
		const promise = new Promise<Response>((resolve, reject) => {
			doResolve = resolve
			doReject = reject
		})

		let result: Response
		stream.ondata = (response) => result = response
		stream.onend = () => doResolve(result)
		stream.onerror = (err) => doReject(err)

		stream.sendCall(method, metadata)
		stream.sendRequest(request)

		return promise
	}

	rpcCall<Request, Response>(
		method: string,
		request: Request,
		metadata: Metadata,
		methodInfo: AbstractClientBase.MethodInfo<Request, Response>,
		callback: (err: Error, response: Response) => void)
		: ClientReadableStream<Response> {

		const stream = new WebRtcClientStream<Request, Response>(this.channel, methodInfo)

		let result: Response
		stream.ondata = (response) => result = response
		//@ts-ignore callback signature is (Error|null, Response)
		stream.onend = () => callback(null, result)
		stream.onerror = (err) => callback(err, result)

		stream.sendCall(method, metadata)
		stream.sendRequest(request)

		return stream
	}

	serverStreaming<Request, Response>(
		method: string,
		request: Request,
		metadata: Metadata,
		methodInfo: AbstractClientBase.MethodInfo<Request, Response>)
		: ClientReadableStream<Response> {

		const stream = new WebRtcClientStream<Request, Response>(this.channel, methodInfo)

		stream.sendCall(method, metadata)
		stream.sendRequest(request)

		return stream
	}
}
