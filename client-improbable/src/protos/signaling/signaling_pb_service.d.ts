// package: signaling
// file: signaling/signaling.proto

import * as signaling_signaling_pb from "../signaling/signaling_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SignalingServiceOffer = {
  readonly methodName: string;
  readonly service: typeof SignalingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof signaling_signaling_pb.OfferRequest;
  readonly responseType: typeof signaling_signaling_pb.OfferResponse;
};

export class SignalingService {
  static readonly serviceName: string;
  static readonly Offer: SignalingServiceOffer;
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

export class SignalingServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  offer(
    requestMessage: signaling_signaling_pb.OfferRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: signaling_signaling_pb.OfferResponse|null) => void
  ): UnaryResponse;
  offer(
    requestMessage: signaling_signaling_pb.OfferRequest,
    callback: (error: ServiceError|null, responseMessage: signaling_signaling_pb.OfferResponse|null) => void
  ): UnaryResponse;
}

