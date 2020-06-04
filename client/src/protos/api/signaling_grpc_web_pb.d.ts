import * as grpcWeb from 'grpc-web';

import {
  OfferRequest,
  OfferResponse} from './signaling_pb';

export class SignalingServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  offer(
    request: OfferRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: OfferResponse) => void
  ): grpcWeb.ClientReadableStream<OfferResponse>;

}

export class SignalingServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  offer(
    request: OfferRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<OfferResponse>;

}

