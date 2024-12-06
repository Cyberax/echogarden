import { SynthesisVoice } from '../api/API.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function synthesizeLongText(text: string, voice: string, languageCode: string, sentenceEndPause?: number, segmentEndPause?: number): Promise<{
    rawAudio: {
        audioChannels: Float32Array<ArrayBufferLike>[];
        sampleRate: number;
    };
    timeline: Timeline;
}>;
export declare function synthesizeFragment(text: string, voice: string): Promise<Uint8Array<ArrayBuffer>>;
export declare const voiceList: SynthesisVoice[];
