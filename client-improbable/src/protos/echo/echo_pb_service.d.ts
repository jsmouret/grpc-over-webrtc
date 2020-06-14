// package: grpc.gateway.testing
// file: echo/echo.proto

import * as echo_echo_pb from "../echo/echo_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EchoServiceEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof echo_echo_pb.EchoRequest;
  readonly responseType: typeof echo_echo_pb.EchoResponse;
};

type EchoServiceEchoAbort = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof echo_echo_pb.EchoRequest;
  readonly responseType: typeof echo_echo_pb.EchoResponse;
};

type EchoServiceNoOp = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof echo_echo_pb.Empty;
  readonly responseType: typeof echo_echo_pb.Empty;
};

type EchoServiceServerStreamingEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof echo_echo_pb.ServerStreamingEchoRequest;
  readonly responseType: typeof echo_echo_pb.ServerStreamingEchoResponse;
};

type EchoServiceServerStreamingEchoAbort = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof echo_echo_pb.ServerStreamingEchoRequest;
  readonly responseType: typeof echo_echo_pb.ServerStreamingEchoResponse;
};

type EchoServiceClientStreamingEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: true;
  readonly responseStream: false;
  readonly requestType: typeof echo_echo_pb.ClientStreamingEchoRequest;
  readonly responseType: typeof echo_echo_pb.ClientStreamingEchoResponse;
};

type EchoServiceFullDuplexEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof echo_echo_pb.EchoRequest;
  readonly responseType: typeof echo_echo_pb.EchoResponse;
};

type EchoServiceHalfDuplexEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof echo_echo_pb.EchoRequest;
  readonly responseType: typeof echo_echo_pb.EchoResponse;
};

export class EchoService {
  static readonly serviceName: string;
  static readonly Echo: EchoServiceEcho;
  static readonly EchoAbort: EchoServiceEchoAbort;
  static readonly NoOp: EchoServiceNoOp;
  static readonly ServerStreamingEcho: EchoServiceServerStreamingEcho;
  static readonly ServerStreamingEchoAbort: EchoServiceServerStreamingEchoAbort;
  static readonly ClientStreamingEcho: EchoServiceClientStreamingEcho;
  static readonly FullDuplexEcho: EchoServiceFullDuplexEcho;
  static readonly HalfDuplexEcho: EchoServiceHalfDuplexEcho;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class EchoServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  echo(
    requestMessage: echo_echo_pb.EchoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  echo(
    requestMessage: echo_echo_pb.EchoRequest,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  echoAbort(
    requestMessage: echo_echo_pb.EchoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  echoAbort(
    requestMessage: echo_echo_pb.EchoRequest,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  noOp(
    requestMessage: echo_echo_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.Empty|null) => void
  ): UnaryResponse;
  noOp(
    requestMessage: echo_echo_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: echo_echo_pb.Empty|null) => void
  ): UnaryResponse;
  serverStreamingEcho(requestMessage: echo_echo_pb.ServerStreamingEchoRequest, metadata?: grpc.Metadata): ResponseStream<echo_echo_pb.ServerStreamingEchoResponse>;
  serverStreamingEchoAbort(requestMessage: echo_echo_pb.ServerStreamingEchoRequest, metadata?: grpc.Metadata): ResponseStream<echo_echo_pb.ServerStreamingEchoResponse>;
  clientStreamingEcho(metadata?: grpc.Metadata): RequestStream<echo_echo_pb.ClientStreamingEchoRequest>;
  fullDuplexEcho(metadata?: grpc.Metadata): BidirectionalStream<echo_echo_pb.EchoRequest, echo_echo_pb.EchoResponse>;
  halfDuplexEcho(metadata?: grpc.Metadata): BidirectionalStream<echo_echo_pb.EchoRequest, echo_echo_pb.EchoResponse>;
}

