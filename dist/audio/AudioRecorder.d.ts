import { RawAudio } from './AudioUtilities.js';
export declare function recordAudioInput(channelCount?: number, sampleRate?: number, maxTime?: number): Promise<RawAudio>;
export declare function captureAudioInput(channelCount?: number, sampleRate?: number, maxTime?: number, onAudioSamples?: (rawAudio: Float32Array[]) => void): Promise<void>;
