import { Readable } from 'stream';
import { EventEmitter } from 'events';
import { ReadStream as FsReadStream } from 'fs';
export function createVirtualFileReadStreamForBuffer(buffer, path) {
    const bufferReadStream = new VirtualFileReadStream(buffer, path);
    const proxyStream = new Proxy(bufferReadStream, {
        get(target, prop) {
            if (prop === Symbol.toStringTag) {
                return 'ReadStream';
            }
            return target[prop];
        },
        getPrototypeOf() {
            return FsReadStream.prototype;
        }
    });
    return proxyStream;
}
export class VirtualFileReadStream extends Readable {
    buffer;
    position;
    bytesRead;
    path;
    pending;
    emitter;
    constructor(buffer, virtualPath) {
        super({ autoDestroy: false });
        this.buffer = buffer;
        this.position = 0;
        this.bytesRead = 0;
        this.path = virtualPath || '';
        this.pending = true;
        this.emitter = new EventEmitter();
        this.emitter.emit('open', 0);
        this.pending = false;
        this.emitter.emit('ready');
    }
    _read(size) {
        if (this.position >= this.buffer.length) {
            this.push(null);
            this.emitter.emit('end');
            this.emitter.emit('finish');
            this.emitter.emit('close');
            return;
        }
        const chunkSize = Math.min(size, this.buffer.length - this.position);
        const chunk = this.buffer.subarray(this.position, this.position + chunkSize);
        this.position += chunkSize;
        this.bytesRead = this.position;
        this.push(chunk);
    }
    close(callback) {
        this.emitter.emit('close');
        if (callback) {
            callback(null);
        }
    }
    addListener(event, listener) {
        this.emitter.addListener(event, listener);
        return this;
    }
    on(event, listener) {
        this.emitter.on(event, listener);
        return this;
    }
    once(event, listener) {
        this.emitter.once(event, listener);
        return this;
    }
    prependListener(event, listener) {
        this.emitter.prependListener(event, listener);
        return this;
    }
    prependOnceListener(event, listener) {
        this.emitter.prependOnceListener(event, listener);
        return this;
    }
}
//# sourceMappingURL=VirtualFileReadStream.js.map