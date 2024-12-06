import { write, open, close } from "./FileSystem.js";
export class FileWriter {
    filePath;
    fileHandle;
    disposed = false;
    writeOffset = 0;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async write(chunk) {
        if (this.isDisposed) {
            throw new Error(`FileWriter has been disposed`);
        }
        await this.openIfNeeded();
        let chunkReadOffset = 0;
        while (chunkReadOffset < chunk.length) {
            let bytesWritten;
            try {
                ({ bytesWritten } = await write(this.fileHandle, chunk, chunkReadOffset, undefined, this.writeOffset));
            }
            catch (e) {
                await this.dispose();
                throw e;
            }
            chunkReadOffset += bytesWritten;
            this.writeOffset += bytesWritten;
        }
    }
    async openIfNeeded() {
        if (this.isDisposed) {
            throw new Error(`FileWriter has been disposed`);
        }
        if (this.isOpened) {
            return;
        }
        this.fileHandle = await open(this.filePath, 'w');
    }
    async dispose() {
        if (this.isDisposed) {
            return;
        }
        if (this.isOpened) {
            try {
                await close(this.fileHandle);
            }
            catch (e) {
            }
        }
        this.disposed = true;
        this.writeOffset = 0;
        this.fileHandle = undefined;
    }
    get isOpened() {
        return this.fileHandle !== undefined;
    }
    get isDisposed() {
        return this.disposed;
    }
}
//# sourceMappingURL=FileWriter.js.map