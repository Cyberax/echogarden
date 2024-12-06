import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { Timeline } from '../utilities/Timeline.js';
import { EngineMetadata } from './Common.js';
import { type AdaptiveGateVADOptions } from '../voice-activity-detection/AdaptiveGateVAD.js';
import { type WhisperVADOptions } from '../recognition/WhisperSTT.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function detectVoiceActivity(input: AudioSourceParam, options: VADOptions): Promise<VADResult>;
export declare function convertCroppedToUncroppedTimeline(timeline: Timeline, uncropTimeline: Timeline): void;
export interface VADResult {
    timeline: Timeline;
    verboseTimeline: Timeline;
    inputRawAudio: RawAudio;
    croppedRawAudio: RawAudio;
}
export type VADEngine = 'webrtc' | 'silero' | 'rnnoise' | 'whisper' | 'adaptive-gate';
export interface VADOptions {
    engine?: VADEngine;
    activityThreshold?: number;
    webrtc?: {
        frameDuration?: 10 | 20 | 30;
        mode?: 0 | 1 | 2 | 3;
    };
    silero?: {
        frameDuration?: 30 | 60 | 90;
        provider?: OnnxExecutionProvider;
    };
    rnnoise?: {};
    whisper?: WhisperVADOptions;
    adaptiveGate?: AdaptiveGateVADOptions;
}
export declare const defaultVADOptions: VADOptions;
export declare const vadEngines: EngineMetadata[];
