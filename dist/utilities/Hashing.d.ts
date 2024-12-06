export declare function murmurHash3(bytes: Uint8Array, seed?: number): number;
export declare function convertToSingleInt32Hash(hash: (bytes: Uint8Array) => number): (int32Val: number) => number;
export declare const murmurHash3_int32Input: (int32Val: number) => number;
