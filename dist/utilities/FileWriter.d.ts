export declare class FileWriter {
    readonly filePath: string;
    private fileHandle?;
    private disposed;
    private writeOffset;
    constructor(filePath: string);
    write(chunk: Uint8Array): Promise<void>;
    private openIfNeeded;
    dispose(): Promise<void>;
    get isOpened(): boolean;
    get isDisposed(): boolean;
}
