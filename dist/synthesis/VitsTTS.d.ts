import type * as Onnx from 'onnxruntime-node';
import { SynthesisVoice } from '../api/API.js';
import { RawAudio } from '../audio/AudioUtilities.js';
import { Lexicon } from '../nlp/Lexicon.js';
import { Timeline } from '../utilities/Timeline.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function synthesizeSentence(text: string, voiceName: string, modelPath: string, lengthScale: number, speakerId: number, lexicons: Lexicon[], executionProviders: OnnxExecutionProvider[]): Promise<{
    rawAudio: RawAudio;
    timeline: import("../utilities/Timeline.js").TimelineEntry[];
    referenceSynthesizedAudio: RawAudio;
    referenceTimeline: Timeline;
}>;
export declare class VitsTTS {
    readonly voiceName: string;
    readonly modelPath: string;
    readonly executionProviders: OnnxExecutionProvider[];
    session?: Onnx.InferenceSession;
    metadata?: any;
    phonemeMap?: Map<string, number[]>;
    constructor(voiceName: string, modelPath: string, executionProviders: OnnxExecutionProvider[]);
    synthesizeSentence(sentence: string, lengthScale: number, speakerId?: number, lexicons?: Lexicon[]): Promise<{
        rawAudio: RawAudio;
        timeline: import("../utilities/Timeline.js").TimelineEntry[];
        referenceSynthesizedAudio: RawAudio;
        referenceTimeline: Timeline;
    }>;
    initializeIfNeeded(): Promise<void>;
}
export declare const voiceList: SynthesisVoice[];
