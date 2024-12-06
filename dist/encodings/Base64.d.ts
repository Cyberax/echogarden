export declare function encodeBase64(inputBytes: Uint8Array, paddingCharacter?: string | undefined, charCodeMap?: Uint8Array): string;
export declare function encodeBase64AsAsciiBuffer(inputBytes: Uint8Array, asciiBuffer?: Uint8Array, paddingCharacter?: string | undefined, charCodeMap?: Uint8Array): Uint8Array;
export declare function decodeBase64(base64String: string, outputBuffer?: Uint8Array, paddingCharacter?: string, reverseCharCodeMap?: Uint8Array): Uint8Array;
export declare const defaultBase64CharCodeMap: Uint8Array;
export declare const defaultBase64ReverseCharCodeMap: Uint8Array;
