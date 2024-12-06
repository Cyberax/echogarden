export declare function decodeTimitAudioFile(filename: string): Promise<{
    audioChannels: Float32Array<ArrayBufferLike>[];
    sampleRate: number;
}>;
export declare function decodeTimitAudio(data: Uint8Array): {
    audioChannels: Float32Array<ArrayBufferLike>[];
    sampleRate: number;
};
