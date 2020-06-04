import React, { useState } from 'react'
import { adapter } from './grtc/adapter'
import { WebRtcChannel } from './grtc/webrtcchannel'
import { EchoServicePromiseClient } from './protos/echo/echo_grpc_web_pb'
import { EchoRequest, Empty } from './protos/echo/echo_pb'

const codeToString = (code: number) => {
	switch (code) {
		case 0: return "OK"
		case 1: return "Canceled"
		case 2: return "Unknown"
		case 3: return "InvalidArgument"
		case 4: return "DeadlineExceeded"
		case 5: return "NotFound"
		case 6: return "AlreadyExists"
		case 7: return "PermissionDenied"
		case 8: return "ResourceExhausted"
		case 9: return "FailedPrecondition"
		case 10: return "Aborted"
		case 11: return "OutOfRange"
		case 12: return "Unimplemented"
		case 13: return "Internal"
		case 14: return "Unavailable"
		case 15: return "DataLoss"
		case 16: return "Unauthenticated"
		default: return `Code(${code})`
	}
}

export const EchoClient: React.FC<{
	channel: WebRtcChannel
	log: (...messages: string[]) => void
}> = ({ channel, log }) => {

	const [message, setMessage] = useState("hello")
	const [client] = useState(adapter(channel, new EchoServicePromiseClient("")))

	const logException = (prefix: string, e: any) =>
		log(prefix, " exception:\n> ", codeToString(e.code), ": ", e.message)

	const echo = async () => {
		try {
			const request = new EchoRequest()
			request.setMessage(message)

			const response = await client.echo(request)
			log("echo: ", response.getMessage(),
				" #", response.getMessageCount().toString())

		} catch (e) {
			logException("echo", e)
		}
	}

	const echoAbort = async () => {
		try {
			const request = new EchoRequest()
			request.setMessage(message)

			const response = await client.echoAbort(request)
			log("echoAbort: ", response.getMessage(),
				" #", response.getMessageCount().toString())

		} catch (e) {
			logException("echoAbort", e)
		}
	}

	const noOp = async () => {
		try {
			const request = new Empty()
			await client.noOp(request)
			log("noOp")
		} catch (e) {
			logException("noOp", e)
		}
	}

	return (<>
		<h3>Echo Client</h3>
		<input
			value={message}
			onChange={ev => setMessage(ev.target.value)}
		/>
		{' '}<button onClick={echo}>Echo</button>
		{' '}<button onClick={echoAbort}>EchoAbort</button>
		<br /><br />
		<button onClick={noOp}>NoOp</button>
	</>)
}
