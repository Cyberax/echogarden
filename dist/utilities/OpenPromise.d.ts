export declare class OpenPromise<T = void> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
    constructor();
}
