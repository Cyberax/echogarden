import { EncodeIntoResult } from "./TextEncodingsCommon.js";
export declare function encodeAscii(asciiString: string): Uint8Array<ArrayBuffer>;
export declare function encodeAsciiInto(asciiString: string, resultBuffer: Uint8Array): EncodeIntoResult;
export declare function decodeAscii(encodedString: Uint8Array): string;
export declare class ChunkedAsciiDecoder {
    private str;
    private readonly textDecoder;
    writeChunk(chunk: Uint8Array): void;
    toString(): string;
}
