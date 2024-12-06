export declare class Queue<T> {
    list: T[];
    constructor();
    enqueue(item: T): void;
    dequeue(): T | undefined;
    get isEmpty(): boolean;
    get isNonempty(): boolean;
}
