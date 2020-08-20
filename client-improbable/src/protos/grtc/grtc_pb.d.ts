// package: grtc
// file: grtc/grtc.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_rpc_status_pb from "../google/rpc/status_pb";

export class Routing extends jspb.Message { 
    getSequence(): number;
    setSequence(value: number): Routing;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Routing.AsObject;
    static toObject(includeInstance: boolean, msg: Routing): Routing.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasRouting(): boolean;
    clearRouting(): void;
    getRouting(): Routing | undefined;
    setRouting(value?: Routing): Request;


    hasCall(): boolean;
    clearCall(): void;
    getCall(): Call | undefined;
    setCall(value?: Call): Request;


    hasData(): boolean;
    clearData(): void;
    getData(): Data | undefined;
    setData(value?: Data): Request;


    hasEnd(): boolean;
    clearEnd(): void;
    getEnd(): End | undefined;
    setEnd(value?: End): Request;


    getTypeCase(): Request.TypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasRouting(): boolean;
    clearRouting(): void;
    getRouting(): Routing | undefined;
    setRouting(value?: Routing): Response;


    hasBegin(): boolean;
    clearBegin(): void;
    getBegin(): Begin | undefined;
    setBegin(value?: Begin): Response;


    hasData(): boolean;
    clearData(): void;
    getData(): Data | undefined;
    setData(value?: Data): Response;


    hasEnd(): boolean;
    clearEnd(): void;
    getEnd(): End | undefined;
    setEnd(value?: End): Response;


    getTypeCase(): Response.TypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Response.AsObject;
    static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Response;
    static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
    export type AsObject = {
        routing?: Routing.AsObject,
        begin?: Begin.AsObject,
        data?: Data.AsObject,
        end?: End.AsObject,
    }

    export enum TypeCase {
        TYPE_NOT_SET = 0,
    
    BEGIN = 2,

    DATA = 3,

    END = 4,

    }

}

export class Strings extends jspb.Message { 
    clearValuesList(): void;
    getValuesList(): Array<string>;
    setValuesList(value: Array<string>): Strings;
    addValues(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Strings.AsObject;
    static toObject(includeInstance: boolean, msg: Strings): Strings.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    clearMdMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Metadata.AsObject;
    static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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


    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): Metadata | undefined;
    setMetadata(value?: Metadata): Call;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Call.AsObject;
    static toObject(includeInstance: boolean, msg: Call): Call.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

export class Begin extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Metadata | undefined;
    setHeader(value?: Metadata): Begin;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Begin.AsObject;
    static toObject(includeInstance: boolean, msg: Begin): Begin.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Begin, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Begin;
    static deserializeBinaryFromReader(message: Begin, reader: jspb.BinaryReader): Begin;
}

export namespace Begin {
    export type AsObject = {
        header?: Metadata.AsObject,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): google_rpc_status_pb.Status | undefined;
    setStatus(value?: google_rpc_status_pb.Status): End;


    hasTrailer(): boolean;
    clearTrailer(): void;
    getTrailer(): Metadata | undefined;
    setTrailer(value?: Metadata): End;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): End.AsObject;
    static toObject(includeInstance: boolean, msg: End): End.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
