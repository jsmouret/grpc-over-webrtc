// package: signaling
// file: signaling/signaling.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as signaling_signaling_pb from "../signaling/signaling_pb";

interface ISignalingServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    offer: ISignalingServiceService_IOffer;
}

interface ISignalingServiceService_IOffer extends grpc.MethodDefinition<signaling_signaling_pb.OfferRequest, signaling_signaling_pb.OfferResponse> {
    path: string; // "/signaling.SignalingService/Offer"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<signaling_signaling_pb.OfferRequest>;
    requestDeserialize: grpc.deserialize<signaling_signaling_pb.OfferRequest>;
    responseSerialize: grpc.serialize<signaling_signaling_pb.OfferResponse>;
    responseDeserialize: grpc.deserialize<signaling_signaling_pb.OfferResponse>;
}

export const SignalingServiceService: ISignalingServiceService;

export interface ISignalingServiceServer {
    offer: grpc.handleUnaryCall<signaling_signaling_pb.OfferRequest, signaling_signaling_pb.OfferResponse>;
}

export interface ISignalingServiceClient {
    offer(request: signaling_signaling_pb.OfferRequest, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
    offer(request: signaling_signaling_pb.OfferRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
    offer(request: signaling_signaling_pb.OfferRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
}

export class SignalingServiceClient extends grpc.Client implements ISignalingServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public offer(request: signaling_signaling_pb.OfferRequest, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
    public offer(request: signaling_signaling_pb.OfferRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
    public offer(request: signaling_signaling_pb.OfferRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: signaling_signaling_pb.OfferResponse) => void): grpc.ClientUnaryCall;
}
