export function encodeUtf8(text) {
    const textEncoder = new TextEncoder();
    return textEncoder.encode(text);
}
export function encodeUtf8Into(text, outputArray) {
    const textEncoder = new TextEncoder();
    const result = textEncoder.encodeInto(text, outputArray);
    return result;
}
export function decodeUtf8(encodedString) {
    const maxChunkLength = 2 ** 24;
    const decoder = new ChunkedUtf8Decoder();
    for (let offset = 0; offset < encodedString.length; offset += maxChunkLength) {
        const chunk = encodedString.subarray(offset, offset + maxChunkLength);
        decoder.writeChunk(chunk);
    }
    return decoder.toString();
}
export class ChunkedUtf8Decoder {
    str = '';
    textDecoder = new TextDecoder('utf-8');
    writeChunk(chunk) {
        const decodedChunk = this.textDecoder.decode(chunk);
        this.str += decodedChunk;
    }
    toString() {
        return this.str;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
// Pure JavaScript implementations
//////////////////////////////////////////////////////////////////////////////////////////////
function encodeUtf8Into_JS(str, outputArray) {
    let readOffset = 0;
    let writeOffset = 0;
    while (readOffset < str.length) {
        const charCode = str.codePointAt(readOffset++);
        if (charCode <= 0x7f) {
            outputArray[writeOffset++] = charCode;
        }
        else if (charCode <= 0x7ff) {
            outputArray[writeOffset++] = 0xc0 | (charCode >>> 6);
            outputArray[writeOffset++] = 0x80 | (charCode & 63);
        }
        else if (charCode <= 0xffff) {
            outputArray[writeOffset++] = 0xe0 | (charCode >>> 12);
            outputArray[writeOffset++] = 0x80 | ((charCode >>> 6) & 63);
            outputArray[writeOffset++] = 0x80 | (charCode & 63);
        }
        else if (charCode <= 0x10ffff) {
            outputArray[writeOffset++] = 0xf0 | (charCode >>> 18);
            outputArray[writeOffset++] = 0x80 | ((charCode >>> 12) & 63);
            outputArray[writeOffset++] = 0x80 | ((charCode >>> 6) & 63);
            outputArray[writeOffset++] = 0x80 | (charCode & 63);
            readOffset++;
        }
    }
    return { read: str.length, written: writeOffset };
}
function decodeUtf8_JS(utf8Bytes) {
    let decodedString = '';
    let readOffset = 0;
    while (readOffset < utf8Bytes.length) {
        const leadByte = utf8Bytes[readOffset++];
        let outputCodePoint;
        if (leadByte >>> 7 === 0) {
            outputCodePoint = leadByte;
        }
        else if (leadByte >>> 5 === 6) {
            outputCodePoint =
                (leadByte & 31) << 6 |
                    (utf8Bytes[readOffset++] & 63);
        }
        else if (leadByte >>> 4 === 14) {
            outputCodePoint =
                (leadByte & 15) << 12 |
                    (utf8Bytes[readOffset++] & 63) << 6 |
                    (utf8Bytes[readOffset++] & 63);
        }
        else if (leadByte >>> 3 === 30) {
            outputCodePoint =
                (leadByte & 7) << 18 |
                    (utf8Bytes[readOffset++] & 63) << 12 |
                    (utf8Bytes[readOffset++] & 63) << 6 |
                    (utf8Bytes[readOffset++] & 63);
        }
        else {
            throw new Error(`Invalid UTF-8 stream: An invalid lead byte value encountered at position ${readOffset}`);
        }
        decodedString += String.fromCodePoint(outputCodePoint);
    }
    if (readOffset > utf8Bytes.length) {
        throw new Error(`UTF-8 decoding failed. Byte sequence is truncated.`);
    }
    return decodedString;
}
//# sourceMappingURL=Utf8.js.map