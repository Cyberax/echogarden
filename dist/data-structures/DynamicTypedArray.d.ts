import { TypedArray, TypedArrayConstructor } from "../typings/TypedArray.js";
export declare class DynamicTypedArray<T extends TypedArray> {
    private TypedArrayConstructor;
    elements: TypedArray;
    length: number;
    constructor(TypedArrayConstructor: TypedArrayConstructor<T>, initialCapacity?: number);
    add(newElement: number): void;
    addMany(...newElements: number[]): void;
    addArray(newElements: ArrayLike<number>): void;
    ensureCapacity(requiredCapacity: number): void;
    toTypedArray(): T;
    clear(): void;
}
export declare function createDynamicUint8Array(initialCapacity?: number): DynamicUint8Array;
export declare function createDynamicUint16Array(initialCapacity?: number): DynamicUint16Array;
export type DynamicUint8Array = DynamicTypedArray<Uint8Array>;
export type DynamicUint16Array = DynamicTypedArray<Uint16Array>;
