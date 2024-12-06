export function encodeUtf32(text) {
    const resultArray = new Uint32Array(text.length * 2);
    const { written } = encodeUtf32Into(text, resultArray);
    return resultArray.subarray(0, written);
}
export function encodeUtf32Into(text, resultBuffer) {
    const len = text.length;
    let readOffset = 0;
    let writeOffset = 0;
    while (readOffset < len && writeOffset < resultBuffer.length) {
        const codepoint = text.codePointAt(readOffset);
        if (codepoint === undefined) {
            throw new Error(`Couldn't read a codepoint at offset ${readOffset}`);
        }
        resultBuffer[writeOffset++] = codepoint;
        if (codepoint > 0xffff) {
            readOffset += 2;
        }
        else {
            readOffset += 1;
        }
    }
    return { read: readOffset, written: writeOffset };
}
export function decodeUtf32(encodedString) {
    let result = '';
    for (let i = 0; i < encodedString.length; i++) {
        result += String.fromCodePoint(encodedString[i]);
    }
    return result;
}
//# sourceMappingURL=Utf32.js.map