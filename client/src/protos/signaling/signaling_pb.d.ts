import * as jspb from "google-protobuf"

export class OfferRequest extends jspb.Message {
  getSdp(): string;
  setSdp(value: string): OfferRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OfferRequest): OfferRequest.AsObject;
  static serializeBinaryToWriter(message: OfferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferRequest;
  static deserializeBinaryFromReader(message: OfferRequest, reader: jspb.BinaryReader): OfferRequest;
}

export namespace OfferRequest {
  export type AsObject = {
    sdp: string,
  }
}

export class OfferResponse extends jspb.Message {
  getSdp(): string;
  setSdp(value: string): OfferResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OfferResponse): OfferResponse.AsObject;
  static serializeBinaryToWriter(message: OfferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferResponse;
  static deserializeBinaryFromReader(message: OfferResponse, reader: jspb.BinaryReader): OfferResponse;
}

export namespace OfferResponse {
  export type AsObject = {
    sdp: string,
  }
}

