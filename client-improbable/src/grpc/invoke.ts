import { grpc } from "@improbable-eng/grpc-web"
import { BrowserHeaders as Metadata } from "browser-headers"
import { client } from "./client"
type Code = grpc.Code
type ProtobufMessage = grpc.ProtobufMessage
type MethodDefinition<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = grpc.MethodDefinition<TRequest, TResponse>
type RpcOptions = grpc.RpcOptions

export interface Request {
	close: () => void
}

export interface InvokeRpcOptions<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> extends RpcOptions {
	host: string
	request: TRequest
	metadata?: Metadata.ConstructorArg
	onHeaders?: (headers: Metadata) => void
	onMessage?: (res: TResponse) => void
	onEnd: (code: Code, message: string, trailers: Metadata) => void
}


export function invoke<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage, M extends MethodDefinition<TRequest, TResponse>>(methodDescriptor: M, props: InvokeRpcOptions<TRequest, TResponse>): Request {
	if (methodDescriptor.requestStream) {
		throw new Error(".invoke cannot be used with client-streaming methods. Use .client instead.")
	}

	// client can throw an error if the transport factory returns an error (e.g. no valid transport)
	const grpcClient = client<TRequest, TResponse, M>(methodDescriptor, {
		host: props.host,
		transport: props.transport,
		debug: props.debug,
	})

	if (props.onHeaders) {
		grpcClient.onHeaders(props.onHeaders)
	}
	if (props.onMessage) {
		grpcClient.onMessage(props.onMessage)
	}
	if (props.onEnd) {
		grpcClient.onEnd(props.onEnd)
	}

	grpcClient.start(props.metadata)
	grpcClient.send(props.request)
	grpcClient.finishSend()

	return {
		close: () => {
			grpcClient.close()
		}
	}
}
