import { WebRtcChannel } from "./webrtcchannel"
import { WebRtcClientBase } from "./webrtcclientbase"

export const adapter = <TServiceClient>(channel: WebRtcChannel, service: TServiceClient) => {
	//@ts-ignore
	service.client_ = new WebRtcClientBase(channel)
	return service
}
