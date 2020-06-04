import * as grpcWeb from 'grpc-web';

import {
  EchoRequest,
  EchoResponse} from './echo_pb';

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

}

export class EchoServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  echo(
    request: EchoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<EchoResponse>;

}

