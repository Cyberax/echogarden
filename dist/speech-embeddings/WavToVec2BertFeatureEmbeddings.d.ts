import type * as Onnx from 'onnxruntime-node';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
import { RawAudio } from "../audio/AudioUtilities.js";
export declare function computeEmbeddings(audioSamples: RawAudio, modelFilePath: string, executionProviders: OnnxExecutionProvider[]): Promise<Float32Array<ArrayBufferLike>[]>;
export declare class Wav2Vec2BertFeatureEmbeddings {
    readonly modelFilePath: string;
    readonly executionProviders: OnnxExecutionProvider[];
    session?: Onnx.InferenceSession;
    constructor(modelFilePath: string, executionProviders: OnnxExecutionProvider[]);
    computeEmbeddings(rawAudio: RawAudio): Promise<Float32Array<ArrayBufferLike>[]>;
    private initializeSessionIfNeeded;
}
