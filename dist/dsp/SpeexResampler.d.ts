import { RawAudio } from '../audio/AudioUtilities.js';
export declare function resampleAudioSpeex(rawAudio: RawAudio, outSampleRate: number, quality?: number): Promise<RawAudio>;
export declare function getSpeexResamplerInstance(): Promise<any>;
