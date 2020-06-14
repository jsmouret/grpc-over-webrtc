import { grpc } from "@improbable-eng/grpc-web"
import { WebRtcChannel } from "../grtc/webrtcchannel"
import { WebRtcClient } from "../grtc/webrtcclient"

export function client<
	TRequest extends grpc.ProtobufMessage, TResponse extends grpc.ProtobufMessage,
	M extends grpc.MethodDefinition<TRequest, TResponse>>
	(methodDescriptor: M, props: grpc.ClientRpcOptions): grpc.Client<TRequest, TResponse> {
	//@ts-ignore
	if (props.host instanceof WebRtcChannel) {
		//@ts-ignore
		return new WebRtcClient<TRequest, TResponse, M>(props.host, methodDescriptor, props)
	}
	return grpc.client(methodDescriptor, props)
}
