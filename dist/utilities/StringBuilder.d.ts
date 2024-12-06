export declare class StringBuilder {
    private outputBuffer;
    constructor(initialCapacity?: number);
    appendCharCode(charCode: number): void;
    appendCharCodes(...charCodes: number[]): void;
    appendCharCodeArray(charCodes: ArrayLike<number>): void;
    appendString(str: string): void;
    appendCodePoint(codePoint: number): void;
    toString(): string;
}
