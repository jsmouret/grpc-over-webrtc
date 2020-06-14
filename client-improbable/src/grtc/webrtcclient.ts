import { grpc } from "@improbable-eng/grpc-web"
import { BrowserHeaders } from "browser-headers"
import * as grtc from "../protos/grtc/grtc_pb"
import { WebRtcAbstractClient } from "./webrtcabstractclient"
import { WebRtcChannel } from "./webrtcchannel"

const fromMetadata = (metadata?: grpc.Metadata.ConstructorArg): grtc.Metadata | undefined => {
	if (!metadata) {
		return undefined
	}
	console.log("metadata", metadata)
	const result = new grtc.Metadata()
	const md = result.getMdMap()
	const headers = new BrowserHeaders(metadata)
	headers.forEach((key, values) => {
		const strings = new grtc.Strings()
		strings.setValuesList(values)
		md.set(key, strings)
	})
	if (result.getMdMap().getLength() === 0) {
		return undefined
	}
	return result
}

const toMetadata = (metadata?: grtc.Metadata): grpc.Metadata => {
	const result = new grpc.Metadata()
	if (metadata) {
		metadata.getMdMap().forEach((entry, key) =>
			result.append(key, entry.getValuesList())
		)
	}
	return result
}

export class WebRtcClient
	<
	TRequest extends grpc.ProtobufMessage,
	TResponse extends grpc.ProtobufMessage,
	M extends grpc.MethodDefinition<TRequest, TResponse>
	>
	extends WebRtcAbstractClient
	implements grpc.Client<TRequest, TResponse> {

	methodDefinition: M
	props: grpc.ClientRpcOptions

	started: boolean = false
	sentFirstMessage: boolean = false
	closed: boolean = false
	finishedSending: boolean = false

	onHeadersCallbacks: Array<(headers: grpc.Metadata) => void> = []
	onMessageCallbacks: Array<(res: TResponse) => void> = []
	onEndCallbacks: Array<(code: grpc.Code, message: string, trailers: grpc.Metadata) => void> = []

	constructor(channel: WebRtcChannel, methodDescriptor: M, props: grpc.ClientRpcOptions) {
		super(channel)
		this.methodDefinition = methodDescriptor
		this.props = props
	}

	// Channel interface

	onChannelBegin(begin: grtc.Begin): void {
		const headers = toMetadata(begin.getHeader())
		if (headers) {
			this.onHeadersCallbacks.forEach(callback => callback(headers))
		}
	}

	onChannelData(data: grtc.Data): void {
		const response = this.methodDefinition.responseType.deserializeBinary(data.getData_asU8())
		this.onMessageCallbacks.forEach(callback => callback(response))
	}

	onChannelEnd(end: grtc.End): void {
		this.props.debug && console.debug("grtc.onChannelEnd")
		if (this.closed) {
			this.props.debug && console.debug("grtc.onChannelEnd received after request was closed - ignoring")
			return
		}

		let code = grpc.Code.OK
		let message = ""
		const trailers = toMetadata(end.getTrailer())

		const status = end.getStatus()
		if (status) {
			code = status.getCode()
			message = status.getMessage()
		}

		this.onEndCallbacks.forEach(callback => callback(code, message, trailers))
		this.done()
	}

	onChannelError(code: number, message: string): void {
		const trailers = toMetadata()
		this.onEndCallbacks.forEach(callback => callback(code, message, trailers))
	}

	// Client interface

	onHeaders(callback: (headers: grpc.Metadata) => void) {
		this.onHeadersCallbacks.push(callback)
	}

	onMessage(callback: (res: TResponse) => void) {
		this.onMessageCallbacks.push(callback)
	}

	onEnd(callback: (code: grpc.Code, message: string, trailers: grpc.Metadata) => void) {
		this.onEndCallbacks.push(callback)
	}

	start(metadata?: grpc.Metadata.ConstructorArg) {
		if (this.started) {
			throw new Error("Client already started - cannot .start()")
		}
		this.started = true

		const method = `/${this.methodDefinition.service.serviceName}/${this.methodDefinition.methodName}`
		this.sendCall(method, fromMetadata(metadata))
	}

	send(msg: TRequest) {
		if (!this.started) {
			throw new Error("Client not started - .start() must be called before .send()")
		}
		if (this.closed) {
			throw new Error("Client already closed - cannot .send()")
		}
		if (this.finishedSending) {
			throw new Error("Client already finished sending - cannot .send()")
		}
		if (!this.methodDefinition.requestStream && this.sentFirstMessage) {
			// This is a unary method and the first and only message has been sent
			throw new Error("Message already sent for non-client-streaming method - cannot .send()")
		}
		this.sentFirstMessage = true

		const data = new grtc.Data()
		data.setData(msg.serializeBinary())
		this.sendData(data)
	}

	finishSend() {
		if (!this.started) {
			throw new Error("Client not started - .finishSend() must be called before .close()")
		}
		if (this.closed) {
			throw new Error("Client already closed - cannot .send()")
		}
		if (this.finishedSending) {
			throw new Error("Client already finished sending - cannot .finishSend()")
		}
		this.finishedSending = true

		this.sendEndStatus()
	}

	close() {
		if (!this.started) {
			throw new Error("Client not started - .start() must be called before .close()")
		}
		if (!this.closed) {
			this.closed = true
			this.props.debug && console.debug("request.abort aborting request")

			this.sendEndStatus(grpc.Code.Canceled, "Cancelled by client")
			this.done()
		} else {
			throw new Error("Client already closed - cannot .close()")
		}
	}
}
