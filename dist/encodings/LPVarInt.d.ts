import { DynamicUint8Array } from "../data-structures/DynamicTypedArray.js";
export declare function encodeUnsignedInt31(value: number, outEncodedData: DynamicUint8Array): void;
export declare function decodeUnsignedInt31(encodedData: ArrayLike<number>, readOffset: number): DecodedValueAndReadOffset;
export declare function encodeSignedInt32(value: number, outEncodedData: DynamicUint8Array): void;
export declare function decodeSignedInt32(encodedData: ArrayLike<number>, readOffset: number): DecodedValueAndReadOffset;
export interface DecodedValueAndReadOffset {
    decodedValue: number;
    readOffset: number;
}
export declare function testLPVarintSigned(): void;
export declare function testLPVarintUnsigned(): void;
