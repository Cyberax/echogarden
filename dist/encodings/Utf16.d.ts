import { EncodeIntoResult } from "./TextEncodingsCommon.js";
export declare function encodeUtf16(text: string): Uint16Array<ArrayBuffer>;
export declare function encodeUtf16Into(text: string, resultBuffer: Uint16Array): EncodeIntoResult;
export declare function decodeUtf16(encodedString: Uint16Array): string;
export declare class ChunkedUtf16Decoder {
    private str;
    private readonly textDecoder;
    writeChunk(chunk: Uint16Array): void;
    toString(): string;
}
