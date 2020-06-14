import { Metadata } from '@improbable-eng/grpc-web/dist/typings/metadata'
import React, { useState } from 'react'
import { EchoRequest, Empty, ServerStreamingEchoRequest, ServerStreamingEchoResponse } from './protos/echo/echo_pb'
import { EchoServiceClient, ResponseStream, ServiceError } from './protos/echo/echo_pb_service'

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

type logFunction = (...messages: string[]) => void

const logMetadata = (log: logFunction, prefix: string, metadata: Metadata | null) => {
	if (metadata) {
		metadata.forEach((key, values) =>
			log(prefix, " metadata[", key, "]='", values.join(";"), "'")
		)
	}
}

const logStream = (log: logFunction, prefix: string, stream: ResponseStream<ServerStreamingEchoResponse>) => {
	stream.on('data', response => log(prefix, " data: ", response.getMessage()))
	stream.on('status', status => {
		log(prefix, " status ", codeToString(status.code), ": '", status.details, "'")
		logMetadata(log, prefix, status.metadata)
	})
	stream.on('end', () => log(prefix, " end"))
}

const logError = (log: logFunction, prefix: string, e: ServiceError) => {
	log(prefix, " error ", codeToString(e.code), ": ", e.message)
	logMetadata(log, ">", e.metadata)
}

export const EchoClient: React.FC<{
	client: EchoServiceClient
	log: (...messages: string[]) => void
}> = ({ client, log }) => {

	const [message, setMessage] = useState("hello")
	const [messageCount, setMessageCount] = useState(5)
	const [messageInterval, setMessageInterval] = useState(1000)

	const echo = async () => {
		const request = new EchoRequest()
		request.setMessage(message)

		client.echo(request, (error, response) => {
			if (error) {
				logError(log, "echo", error)
				return
			}
			if (!response) {
				log("echo: empty response")
				return
			}
			log("echo: ", response.getMessage(), " #", response.getMessageCount().toString())
		})
	}

	const echoAbort = async () => {
		const request = new EchoRequest()
		request.setMessage(message)

		client.echoAbort(request, (error, response) => {
			if (error) {
				logError(log, "echoAbort", error)
				return
			}
			if (!response) {
				log("echoAbort: empty response")
				return
			}
			log("echoAbort: ", response.getMessage(), " #", response.getMessageCount().toString())
		})
	}

	const noOp = async () => {
		const request = new Empty()

		client.noOp(request, (error, response) => {
			if (error) {
				logError(log, "noOp", error)
				return
			}
			log("noOp")
		})
	}

	const serverStreamingEcho = async () => {
		const request = new ServerStreamingEchoRequest()
		request.setMessage(message)
		request.setMessageCount(messageCount)
		request.setMessageInterval(messageInterval)

		const stream = client.serverStreamingEcho(request)
		logStream(log, "serverStreamingEcho", stream)
	}

	const serverStreamingEchoAbort = async () => {
		const request = new ServerStreamingEchoRequest()
		request.setMessage(message)
		request.setMessageCount(messageCount)
		request.setMessageInterval(messageInterval)

		const stream = client.serverStreamingEchoAbort(request)
		logStream(log, "serverStreamingEchoAbort", stream)
	}

	return (<>
		<h3>Echo Client</h3>
		<table><tbody>
			<tr><td>Message</td><td>
				<input value={message}
					onChange={ev => setMessage(ev.target.value)}
				/>
			</td></tr>
			<tr><td>Message Count</td><td>
				<input value={messageCount} type="number"
					onChange={ev => setMessageCount(ev.target.valueAsNumber)}
				/>
			</td></tr>
			<tr><td>Message Interval</td><td>
				<input value={messageInterval} type="number"
					onChange={ev => setMessageInterval(ev.target.valueAsNumber)}
				/>
			</td></tr>
		</tbody></table>
		<p>
			<button onClick={echo}>Echo</button>{' '}
			<button onClick={echoAbort}>EchoAbort</button>
		</p>
		<p>
			<button onClick={noOp}>NoOp</button>
		</p>
		<p>
			<button onClick={serverStreamingEcho}>ServerStreamingEcho</button>{' '}
			<button onClick={serverStreamingEchoAbort}>ServerStreamingEchoAbort</button>
		</p>
	</>)
}
