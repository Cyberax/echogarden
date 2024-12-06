import { SynthesisVoice } from '../api/API.js';
export declare function synthesize(text: string, voiceId: string, modelId: string, options: ElevenlabsTTSOptions): Promise<{
    rawAudio: {
        audioChannels: Float32Array<ArrayBufferLike>[];
        sampleRate: number;
    };
}>;
export declare function getVoiceList(apiKey: string): Promise<SynthesisVoice[]>;
export interface ElevenlabsTTSOptions {
    apiKey?: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
}
export declare const defaultElevenlabsTTSOptions: {
    apiKey: undefined;
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
};
export declare const supporteMultilingualLanguages: string[];
