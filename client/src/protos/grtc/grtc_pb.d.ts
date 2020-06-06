import * as jspb from "google-protobuf"

import * as google_rpc_status_pb from '../google/rpc/status_pb';

export class Routing extends jspb.Message {
  getSequence(): number;
  setSequence(value: number): Routing;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Routing.AsObject;
  static toObject(includeInstance: boolean, msg: Routing): Routing.AsObject;
  static serializeBinaryToWriter(message: Routing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Routing;
  static deserializeBinaryFromReader(message: Routing, reader: jspb.BinaryReader): Routing;
}

export namespace Routing {
  export type AsObject = {
    sequence: number,
  }
}

export class Request extends jspb.Message {
  getRouting(): Routing | undefined;
  setRouting(value?: Routing): Request;
  hasRouting(): boolean;
  clearRouting(): Request;

  getCall(): Call | undefined;
  setCall(value?: Call): Request;
  hasCall(): boolean;
  clearCall(): Request;

  getData(): Data | undefined;
  setData(value?: Data): Request;
  hasData(): boolean;
  clearData(): Request;

  getEnd(): End | undefined;
  setEnd(value?: End): Request;
  hasEnd(): boolean;
  clearEnd(): Request;

  getTypeCase(): Request.TypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request.AsObject;
  static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
  static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request;
  static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
  export type AsObject = {
    routing?: Routing.AsObject,
    call?: Call.AsObject,
    data?: Data.AsObject,
    end?: End.AsObject,
  }

  export enum TypeCase { 
    TYPE_NOT_SET = 0,
    CALL = 2,
    DATA = 3,
    END = 4,
  }
}

export class Response extends jspb.Message {
  getRouting(): Routing | undefined;
  setRouting(value?: Routing): Response;
  hasRouting(): boolean;
  clearRouting(): Response;

  getHeader(): Header | undefined;
  setHeader(value?: Header): Response;
  hasHeader(): boolean;
  clearHeader(): Response;

  getData(): Data | undefined;
  setData(value?: Data): Response;
  hasData(): boolean;
  clearData(): Response;

  getEnd(): End | undefined;
  setEnd(value?: End): Response;
  hasEnd(): boolean;
  clearEnd(): Response;

  getTypeCase(): Response.TypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    routing?: Routing.AsObject,
    header?: Header.AsObject,
    data?: Data.AsObject,
    end?: End.AsObject,
  }

  export enum TypeCase { 
    TYPE_NOT_SET = 0,
    HEADER = 2,
    DATA = 3,
    END = 4,
  }
}

export class Strings extends jspb.Message {
  getValuesList(): Array<string>;
  setValuesList(value: Array<string>): Strings;
  clearValuesList(): Strings;
  addValues(value: string, index?: number): Strings;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Strings.AsObject;
  static toObject(includeInstance: boolean, msg: Strings): Strings.AsObject;
  static serializeBinaryToWriter(message: Strings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Strings;
  static deserializeBinaryFromReader(message: Strings, reader: jspb.BinaryReader): Strings;
}

export namespace Strings {
  export type AsObject = {
    valuesList: Array<string>,
  }
}

export class Metadata extends jspb.Message {
  getMdMap(): jspb.Map<string, Strings>;
  clearMdMap(): Metadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metadata.AsObject;
  static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
  static serializeBinaryToWriter(message: Metadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metadata;
  static deserializeBinaryFromReader(message: Metadata, reader: jspb.BinaryReader): Metadata;
}

export namespace Metadata {
  export type AsObject = {
    mdMap: Array<[string, Strings.AsObject]>,
  }
}

export class Call extends jspb.Message {
  getMethod(): string;
  setMethod(value: string): Call;

  getMetadata(): Metadata | undefined;
  setMetadata(value?: Metadata): Call;
  hasMetadata(): boolean;
  clearMetadata(): Call;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Call.AsObject;
  static toObject(includeInstance: boolean, msg: Call): Call.AsObject;
  static serializeBinaryToWriter(message: Call, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Call;
  static deserializeBinaryFromReader(message: Call, reader: jspb.BinaryReader): Call;
}

export namespace Call {
  export type AsObject = {
    method: string,
    metadata?: Metadata.AsObject,
  }
}

export class Header extends jspb.Message {
  getMetadata(): Metadata | undefined;
  setMetadata(value?: Metadata): Header;
  hasMetadata(): boolean;
  clearMetadata(): Header;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Header.AsObject;
  static toObject(includeInstance: boolean, msg: Header): Header.AsObject;
  static serializeBinaryToWriter(message: Header, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Header;
  static deserializeBinaryFromReader(message: Header, reader: jspb.BinaryReader): Header;
}

export namespace Header {
  export type AsObject = {
    metadata?: Metadata.AsObject,
  }
}

export class Data extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): Data;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Data.AsObject;
  static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
  static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Data;
  static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
  export type AsObject = {
    data: Uint8Array | string,
  }
}

export class End extends jspb.Message {
  getStatus(): google_rpc_status_pb.Status | undefined;
  setStatus(value?: google_rpc_status_pb.Status): End;
  hasStatus(): boolean;
  clearStatus(): End;

  getTrailer(): Metadata | undefined;
  setTrailer(value?: Metadata): End;
  hasTrailer(): boolean;
  clearTrailer(): End;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): End.AsObject;
  static toObject(includeInstance: boolean, msg: End): End.AsObject;
  static serializeBinaryToWriter(message: End, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): End;
  static deserializeBinaryFromReader(message: End, reader: jspb.BinaryReader): End;
}

export namespace End {
  export type AsObject = {
    status?: google_rpc_status_pb.Status.AsObject,
    trailer?: Metadata.AsObject,
  }
}

