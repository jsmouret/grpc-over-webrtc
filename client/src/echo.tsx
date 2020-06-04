import React, { useState } from 'react'
import { adapter } from './adapter'
import { EchoServicePromiseClient } from './protos/api/echo_grpc_web_pb'
import { EchoRequest } from './protos/api/echo_pb'
import { WebRtcChannel } from './webrtcchannel'

export const EchoClient: React.FC<{
	channel: WebRtcChannel
	log: (...messages: string[]) => void
}> = ({ channel, log }) => {

	const [echo, setEcho] = useState("test")
	const sendEcho = async () => {

		try {
			const client = adapter(channel, new EchoServicePromiseClient(""))

			const request = new EchoRequest()
			request.setMessage(echo)

			const response = await client.echo(request)
			log("echo unary: ", response.getMessage(),
				" #", response.getMessageCount().toString())

		} catch (e) {
			log("echo unary error #", e.code, ": ", e.message)
		}
	}

	return (<>
		<h3>Echo Client</h3>
		<input
			value={echo}
			onChange={ev => setEcho(ev.target.value)}
		/>
		<button onClick={sendEcho}>Send</button>
	</>)
}
