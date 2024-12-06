import { open, close, read } from "./FileSystem.js";
export class FileReader {
    filePath;
    fileHandle;
    finished = false;
    disposed = false;
    readOffset = 0;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async readChunk(buffer) {
        if (this.isDisposed) {
            throw new Error(`FileReader has been disposed`);
        }
        await this.openIfNeeded();
        let bufferWriteOffset = 0;
        while (bufferWriteOffset < buffer.length) {
            const remainingSizeInBuffer = buffer.length - bufferWriteOffset;
            let bytesRead;
            try {
                ({ bytesRead } = await read(this.fileHandle, buffer, bufferWriteOffset, remainingSizeInBuffer, this.readOffset));
            }
            catch (e) {
                await this.dispose();
                throw e;
            }
            if (bytesRead === 0) {
                this.finished = true;
                await this.dispose();
                break;
            }
            bufferWriteOffset += bytesRead;
            this.readOffset += bytesRead;
        }
        return buffer.subarray(0, bufferWriteOffset);
    }
    async openIfNeeded() {
        if (this.isDisposed) {
            throw new Error(`FileWriter has been disposed`);
        }
        if (this.isOpened) {
            return;
        }
        this.fileHandle = await open(this.filePath, 'r');
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
        this.readOffset = 0;
        this.fileHandle = undefined;
    }
    get isOpened() {
        return this.fileHandle !== undefined;
    }
    get isDisposed() {
        return this.disposed;
    }
    get isFinished() {
        return this.finished;
    }
}
//# sourceMappingURL=FileReader.js.map