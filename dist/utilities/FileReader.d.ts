export declare class FileReader {
    readonly filePath: string;
    private fileHandle?;
    private finished;
    private disposed;
    private readOffset;
    constructor(filePath: string);
    readChunk(buffer: Uint8Array): Promise<Uint8Array>;
    private openIfNeeded;
    dispose(): Promise<void>;
    get isOpened(): boolean;
    get isDisposed(): boolean;
    get isFinished(): boolean;
}
