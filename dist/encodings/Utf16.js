export function encodeUtf16(text) {
    const resultArray = new Uint16Array(text.length);
    const { written } = encodeUtf16Into(text, resultArray);
    return resultArray.subarray(0, written);
}
export function encodeUtf16Into(text, resultBuffer) {
    const len = text.length;
    if (resultBuffer.length < len) {
        throw new Error(`Result Uint16Array is not large enough to hold the string`);
    }
    for (let readOffset = 0; readOffset < len; readOffset++) {
        resultBuffer[readOffset] = text.charCodeAt(readOffset);
    }
    return { read: len, written: len };
}
export function decodeUtf16(encodedString) {
    const maxChunkLength = 2 ** 24;
    const decoder = new ChunkedUtf16Decoder();
    for (let offset = 0; offset < encodedString.length; offset += maxChunkLength) {
        const chunk = encodedString.subarray(offset, offset + maxChunkLength);
        decoder.writeChunk(chunk);
    }
    return decoder.toString();
}
export class ChunkedUtf16Decoder {
    str = '';
    textDecoder = new TextDecoder('utf-16le');
    writeChunk(chunk) {
        const decodedChunk = this.textDecoder.decode(chunk);
        this.str += decodedChunk;
    }
    toString() {
        return this.str;
    }
}
//# sourceMappingURL=Utf16.js.map