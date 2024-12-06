import { DynamicUint8Array } from "../data-structures/DynamicTypedArray.js";
export declare function encodeUnsignedInt(value: number | bigint, outEncodedData: DynamicUint8Array): DynamicUint8Array;
export declare function decodeUnsignedInt31Fast(encodedData: ArrayLike<number>, readOffset: number): DecodedValueAndReadOffset;
export declare function encodeSignedInt32(value: number, outEncodedData: DynamicUint8Array): DynamicUint8Array;
export declare function encodeSignedInt32Fast(value: number, outEncodedData: DynamicUint8Array): DynamicUint8Array;
export declare function decodeSignedInt32(encodedData: ArrayLike<number>, readOffset: number): DecodedValueAndReadOffset;
export declare function decodeSignedInt32Fast(encodedData: ArrayLike<number>, readOffset: number): {
    decodedValue: number;
    readOffset: number;
};
export interface DecodedValueAndReadOffset {
    decodedValue: number;
    readOffset: number;
}
export declare function testLeb128Signed(): void;
