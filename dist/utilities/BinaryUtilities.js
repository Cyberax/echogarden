/////////////////////////////////////////////////////////////////////////////////////
// Unsigned operations
/////////////////////////////////////////////////////////////////////////////////////
export function readUint8(buffer, offset) {
    return buffer[offset];
}
export function writeUint8(buffer, value, offset) {
    if (value < 0 || value > 255) {
        throw new Error(`Value ${value} is outside the range of an 8-bit unsigned integer`);
    }
    buffer[offset] = value;
}
export function readUint16LE(buffer, offset) {
    return (buffer[offset]) | (buffer[offset + 1] << 8);
}
export function writeUint16LE(buffer, value, offset) {
    if (value < 0 || value > 65535) {
        throw new Error(`Value ${value} is outside the range of a 16-bit unsigned integer`);
    }
    buffer[offset] = value & 0xff;
    buffer[offset + 1] = (value >>> 8) & 0xff;
}
export function readUint32LE(buffer, offset) {
    return readInt32LE(buffer, offset) >>> 0;
}
export function writeUint32LE(buffer, value, offset) {
    if (value < 0 || value > 4294967295) {
        throw new Error(`Value ${value} is outside the range of a 32-bit unsigned integer`);
    }
    buffer[offset] = value & 0xff;
    buffer[offset + 1] = (value >>> 8) & 0xff;
    buffer[offset + 2] = (value >>> 16) & 0xff;
    buffer[offset + 3] = (value >>> 24) & 0xff;
}
/////////////////////////////////////////////////////////////////////////////////////
// Signed operations
/////////////////////////////////////////////////////////////////////////////////////
export function readInt8(buffer, offset) {
    const unsignedValue = buffer[offset];
    if (unsignedValue < 128) {
        return unsignedValue;
    }
    else {
        return unsignedValue - 256;
    }
}
export function writeInt8(buffer, value, offset) {
    if (value < -128 || value > 127) {
        throw new Error(`Value ${value} is outside the range of an 8-bit signed integer`);
    }
    let unsignedValue;
    if (value >= 0) {
        unsignedValue = value;
    }
    else {
        unsignedValue = value + 256;
    }
    buffer[offset] = unsignedValue;
}
export function readInt16LE(buffer, offset) {
    const unsignedValue = readUint16LE(buffer, offset);
    if (unsignedValue < 32768) {
        return unsignedValue;
    }
    else {
        return unsignedValue - 65536;
    }
}
export function writeInt16LE(buffer, value, offset) {
    if (value < -32768 || value > 32767) {
        throw new Error(`Value ${value} is outside the range of a 16-bit signed integer`);
    }
    let unsignedValue;
    if (value >= 0) {
        unsignedValue = value;
    }
    else {
        unsignedValue = value + 65536;
    }
    writeUint16LE(buffer, unsignedValue, offset);
}
export function readInt32LE(buffer, offset) {
    const value = (buffer[offset]) |
        (buffer[offset + 1] << 8) |
        (buffer[offset + 2] << 16) |
        (buffer[offset + 3] << 24);
    return value;
}
export function writeInt32LE(buffer, value, offset) {
    if (value < -2147483648 || value > 2147483647) {
        throw new Error(`Value ${value} is outside the range of a 32-bit signed integer`);
    }
    buffer[offset] = value & 0xff;
    buffer[offset + 1] = (value >> 8) & 0xff;
    buffer[offset + 2] = (value >> 16) & 0xff;
    buffer[offset + 3] = (value >> 24) & 0xff;
}
/////////////////////////////////////////////////////////////////////////////////////
// Misc operations
/////////////////////////////////////////////////////////////////////////////////////
export function writeAscii(buffer, asciiString, writeStartOffset) {
    const writeEndOffset = Math.min(writeStartOffset + asciiString.length, buffer.length);
    let readOffset = 0;
    let writeOffset = writeStartOffset;
    while (writeOffset < writeEndOffset) {
        const charCode = asciiString.charCodeAt(readOffset++);
        if (charCode >= 128) {
            throw new Error(`Character '${asciiString[readOffset]}' (code: ${charCode}) can't be encoded as ASCII`);
        }
        buffer[writeOffset++] = charCode;
    }
}
//# sourceMappingURL=BinaryUtilities.js.map