import { SynthesisVoice } from '../api/API.js';
export type FliteVoiceName = 'kal' | 'kal16' | 'awb' | 'rms' | 'slt' | string;
export declare function synthesize(text: string, voice: FliteVoiceName, voiceDir: string | undefined, rate: number, pitchMeanHz?: number, pitchStdDev?: number): Promise<{
    rawAudio: {
        audioChannels: Float32Array<ArrayBufferLike>[];
        sampleRate: number;
    };
    events: FliteEvent[];
}>;
export type FliteEventType = 'phone' | 'pause' | 'phrasePause';
export type FliteEvent = {
    type: FliteEventType;
    id: string;
    startTime: number;
    endTime: number;
};
export declare const voiceList: SynthesisVoice[];
