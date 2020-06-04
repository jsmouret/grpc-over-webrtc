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
		stream.handlerOnData = (response) => result = response
		stream.handlerOnEnd = () => doResolve(result)
		stream.handlerOnError = (err) => doReject(err)

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
		stream.handlerOnData = (response) => result = response
		stream.handlerOnEnd = () =>
			//@ts-ignore (callback's err type should be Error|null)
			callback(null, result)
		stream.handlerOnError = (err) => callback(err, result)

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
