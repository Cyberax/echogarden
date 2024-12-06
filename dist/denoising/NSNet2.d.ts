import { RawAudio } from '../audio/AudioUtilities.js';
import type * as Onnx from 'onnxruntime-node';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function denoiseAudio(rawAudio: RawAudio, options: NSNet2Options): Promise<{
    denoisedAudio: RawAudio;
}>;
export declare class NSNet2 {
    readonly modelName: NSNet2ModelName;
    readonly modelDirectoryPath: string;
    readonly executionProviders: OnnxExecutionProvider[];
    readonly maxAttenuation: number;
    session?: Onnx.InferenceSession;
    constructor(modelName: NSNet2ModelName, modelDirectoryPath: string, executionProviders: OnnxExecutionProvider[], maxAttenuation: number);
    denoiseAudio(rawAudio: RawAudio): Promise<{
        denoisedAudio: RawAudio;
    }>;
    private initializeIfNeeded;
}
export type NSNet2ModelName = 'baseline-16khz' | 'baseline-48khz';
export declare const defaultNSNet2Options: NSNet2Options;
export interface NSNet2Options {
    model?: NSNet2ModelName;
    modelDirectoryPath?: string;
    provider?: OnnxExecutionProvider;
    maxAttenuation?: number;
}
