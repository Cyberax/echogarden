export function encodeAscii(asciiString) {
    const charCount = asciiString.length;
    const resultArray = new Uint8Array(charCount);
    const { written } = encodeAsciiInto(asciiString, resultArray);
    return resultArray.subarray(0, written);
}
export function encodeAsciiInto(asciiString, resultBuffer) {
    const len = asciiString.length;
    if (resultBuffer.length < len) {
        throw new Error(`Result Uint8Array is not large enough to hold the string`);
    }
    for (let readOffset = 0; readOffset < len; readOffset++) {
        const charCode = asciiString.charCodeAt(readOffset);
        if (charCode >= 128) {
            throw new Error(`Character '${asciiString[readOffset]}' (code: ${charCode}) can't be encoded as a standard ASCII character`);
        }
        resultBuffer[readOffset] = charCode;
    }
    return { read: len, written: len };
}
export function decodeAscii(encodedString) {
    const maxChunkLength = 2 ** 24;
    const decoder = new ChunkedAsciiDecoder();
    for (let offset = 0; offset < encodedString.length; offset += maxChunkLength) {
        const chunk = encodedString.subarray(offset, offset + maxChunkLength);
        decoder.writeChunk(chunk);
    }
    return decoder.toString();
}
export class ChunkedAsciiDecoder {
    str = '';
    textDecoder = new TextDecoder('windows-1252');
    writeChunk(chunk) {
        const decodedChunk = this.textDecoder.decode(chunk);
        this.str += decodedChunk;
    }
    toString() {
        return this.str;
    }
}
//# sourceMappingURL=Ascii.js.map