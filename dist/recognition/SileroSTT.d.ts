import { Timeline } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
import type * as Onnx from 'onnxruntime-node';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function recognize(rawAudio: RawAudio, modelDirectoryPath: string, executionProviders: OnnxExecutionProvider[]): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
export declare class SileroSTT {
    readonly modelDirectoryPath: string;
    readonly executionProviders: OnnxExecutionProvider[];
    session?: Onnx.InferenceSession;
    labels?: string[];
    constructor(modelDirectoryPath: string, executionProviders: OnnxExecutionProvider[]);
    recognize(rawAudio: RawAudio): Promise<{
        transcript: string;
        timeline: Timeline;
    }>;
    private initializeIfNeeded;
    private tokensToTimeline;
}
export declare const languageCodeToPackageName: {
    [languageCode: string]: string;
};
export interface SileroRecognitionOptions {
    modelPath?: string;
    provider?: OnnxExecutionProvider;
}
export declare const defaultSileroRecognitionOptions: SileroRecognitionOptions;
