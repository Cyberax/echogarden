import { EncodeIntoResult } from "./TextEncodingsCommon.js";
export declare function encodeUtf8(text: string): Uint8Array<ArrayBufferLike>;
export declare function encodeUtf8Into(text: string, outputArray: Uint8Array): EncodeIntoResult;
export declare function decodeUtf8(encodedString: Uint8Array): string;
export declare class ChunkedUtf8Decoder {
    private str;
    private readonly textDecoder;
    writeChunk(chunk: Uint8Array): void;
    toString(): string;
}
