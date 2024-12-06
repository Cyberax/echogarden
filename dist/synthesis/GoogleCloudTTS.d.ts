export declare function synthesize(text: string, apiKey: string, languageCode?: string, voice?: string, speakingRate?: number, pitchDeltaSemitones?: number, volumeGainDecibels?: number, ssml?: boolean, audioEncoding?: AudioEncoding, sampleRate?: number): Promise<{
    audioData: Uint8Array<ArrayBufferLike>;
    timepoints: timePoint[];
}>;
export declare function getVoiceList(apiKey: string): Promise<GoogleCloudVoice[]>;
export type GoogleCloudVoice = {
    name: string;
    languageCodes: string[];
    ssmlGender: 'MALE' | 'FEMALE';
    naturalSampleRateHertz: number;
};
export type AudioEncoding = 'LINEAR16' | 'MP3' | 'MP3_64_KBPS' | 'OGG_OPUS' | 'MULAW' | 'ALAW';
export type timePoint = {
    markName: string;
    timeSeconds: number;
};
