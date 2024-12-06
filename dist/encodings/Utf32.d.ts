import { EncodeIntoResult } from "./TextEncodingsCommon.js";
export declare function encodeUtf32(text: string): Uint32Array<ArrayBuffer>;
export declare function encodeUtf32Into(text: string, resultBuffer: Uint32Array): EncodeIntoResult;
export declare function decodeUtf32(encodedString: Uint32Array): string;
