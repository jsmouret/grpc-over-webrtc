import * as grpcWeb from 'grpc-web';

import {
  ClientStreamingEchoRequest,
  ClientStreamingEchoResponse,
  EchoRequest,
  EchoResponse,
  Empty,
  ServerStreamingEchoRequest,
  ServerStreamingEchoResponse} from './echo_pb';

export class EchoServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  echo(
    request: EchoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: EchoResponse) => void
  ): grpcWeb.ClientReadableStream<EchoResponse>;

  echoAbort(
    request: EchoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: EchoResponse) => void
  ): grpcWeb.ClientReadableStream<EchoResponse>;

  noOp(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Empty) => void
  ): grpcWeb.ClientReadableStream<Empty>;

  serverStreamingEcho(
    request: ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<ServerStreamingEchoResponse>;

  serverStreamingEchoAbort(
    request: ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<ServerStreamingEchoResponse>;

}

export class EchoServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  echo(
    request: EchoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<EchoResponse>;

  echoAbort(
    request: EchoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<EchoResponse>;

  noOp(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<Empty>;

  serverStreamingEcho(
    request: ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<ServerStreamingEchoResponse>;

  serverStreamingEchoAbort(
    request: ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<ServerStreamingEchoResponse>;

}

