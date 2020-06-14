// package: signaling
// file: signaling/signaling.proto

import * as jspb from "google-protobuf";

export class OfferRequest extends jspb.Message {
  getSdp(): string;
  setSdp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OfferRequest): OfferRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
  setSdp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OfferResponse): OfferResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OfferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferResponse;
  static deserializeBinaryFromReader(message: OfferResponse, reader: jspb.BinaryReader): OfferResponse;
}

export namespace OfferResponse {
  export type AsObject = {
    sdp: string,
  }
}

