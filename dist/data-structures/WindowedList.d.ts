export declare class WindowedList<T> {
    readonly maxWindowLength: number;
    elements: T[];
    startOffset: number;
    constructor(maxWindowLength: number);
    add(value: T): void;
    get(index: number): T;
    slice(startIndex: number, endIndex: number): T[];
    get endOffset(): number;
}
