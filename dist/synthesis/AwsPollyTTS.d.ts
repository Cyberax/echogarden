export declare function synthesize(text: string, language: string | undefined, voice: string, region: string, accessKeyId: string, secretAccessKey: string, engine?: 'standard' | 'neural', ssmlEnabled?: boolean, lexiconNames?: string[]): Promise<{
    rawAudio: {
        audioChannels: Float32Array<ArrayBufferLike>[];
        sampleRate: number;
    };
}>;
export declare function getVoiceList(region: string, accessKeyId: string, secretAccessKey: string): Promise<import("@aws-sdk/client-polly").Voice[]>;
