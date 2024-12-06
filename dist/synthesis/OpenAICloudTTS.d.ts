import { SynthesisVoice } from '../api/Synthesis.js';
export declare function synthesize(text: string, voice: string, speed: number, options: OpenAICloudTTSOptions): Promise<import("../audio/AudioUtilities.js").RawAudio>;
export interface OpenAICloudTTSOptions {
    apiKey?: string;
    organization?: string;
    baseURL?: string;
    model?: 'tts-1' | 'tts-1-hd';
    timeout?: number;
    maxRetries?: number;
}
export declare const defaultOpenAICloudTTSOptions: OpenAICloudTTSOptions;
export declare const supportedLanguages: string[];
export declare const voiceList: SynthesisVoice[];
