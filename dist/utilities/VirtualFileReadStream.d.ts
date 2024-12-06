import { Readable } from 'stream';
import { EventEmitter } from 'events';
import { ReadStream as FsReadStream } from 'fs';
export declare function createVirtualFileReadStreamForBuffer(buffer: Uint8Array, path?: string): FsReadStream;
export declare class VirtualFileReadStream extends Readable {
    private readonly buffer;
    position: number;
    bytesRead: number;
    readonly path: string;
    pending: boolean;
    readonly emitter: EventEmitter;
    constructor(buffer: Uint8Array, virtualPath?: string);
    _read(size: number): void;
    close(callback?: (err?: NodeJS.ErrnoException | null) => void): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
