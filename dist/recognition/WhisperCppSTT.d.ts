import { RawAudio } from '../audio/AudioUtilities.js';
import { type WhisperTask, type WhisperModelName } from './WhisperSTT.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function recognize(sourceRawAudio: RawAudio, task: WhisperTask, sourceLanguage: string | undefined, modelName: WhisperModelName, modelPath: string, options: WhisperCppOptions): Promise<RecognitionResult>;
export declare function detectLanguage(sourceRawAudio: RawAudio, modelName: WhisperModelName, modelPath: string): Promise<import("../api/LanguageDetectionCommon.js").LanguageDetectionResults>;
export declare function loadModelPackage(modelId: WhisperCppModelId | undefined, languageCode: string | undefined): Promise<{
    modelName: WhisperModelName;
    modelPath: string;
}>;
export type WhisperCppBuild = 'cpu' | 'cublas-12.4.0' | 'custom';
export declare function loadExecutablePackage(buildKind: WhisperCppBuild): Promise<string>;
export interface WhisperCppVerboseResult {
    model: {
        type: string;
        multilingual: boolean;
        ftype: number;
        mels: number;
        vocab: number;
        text: {
            ctx: number;
            state: number;
            head: number;
            layer: number;
        };
        audio: {
            ctx: number;
            state: number;
            head: number;
            layer: number;
        };
    };
    params: {
        language: string;
        model: string;
        translate: boolean;
    };
    result: {
        language: string;
    };
    systeminfo: string;
    transcription: {
        text: string;
        timestamps: {
            from: string;
            to: string;
        };
        offsets: {
            from: number;
            to: number;
        };
        tokens: {
            text: string;
            timestamps: {
                from: string;
                to: string;
            };
            offsets: {
                from: number;
                to: number;
            };
            t_dtw: number;
            p: number;
            id: number;
        }[];
    }[];
}
interface RecognitionResult {
    transcript: string;
    timeline: Timeline;
    language?: string;
}
export interface WhisperCppOptions {
    build?: WhisperCppBuild;
    executablePath?: string;
    enableGPU?: boolean;
    model?: WhisperCppModelId;
    threadCount?: number;
    splitCount?: number;
    topCandidateCount?: number;
    beamCount?: number;
    repetitionThreshold?: number;
    temperature?: number;
    temperatureIncrement?: number;
    prompt?: string;
    enableDTW?: boolean;
    enableFlashAttention?: boolean;
    verbose?: boolean;
}
export declare const defaultWhisperCppOptions: WhisperCppOptions;
export type WhisperCppModelId = 'tiny' | 'tiny-q5_1' | 'tiny.en' | 'tiny.en-q5_1' | 'tiny.en-q8_0' | 'base' | 'base-q5_1' | 'base.en' | 'base.en-q5_1' | 'small' | 'small-q5_1' | 'small.en' | 'small.en-q5_1' | 'medium' | 'medium-q5_0' | 'medium.en' | 'medium.en-q5_0' | 'large' | 'large-v1' | 'large-v2' | 'large-v2-q5_0' | 'large-v3' | 'large-v3-q5_0' | `large-v3-turbo` | `large-v3-turbo-q5_0`;
export {};
