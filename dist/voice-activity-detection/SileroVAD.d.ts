import type * as Onnx from 'onnxruntime-node';
import { RawAudio } from '../audio/AudioUtilities.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function detectVoiceActivity(rawAudio: RawAudio, modelPath: string, frameDuration: 30 | 60 | 90, executionProviders: OnnxExecutionProvider[]): Promise<number[]>;
export declare class SileroVAD {
    readonly modelPath: string;
    readonly executionProviders: OnnxExecutionProvider[];
    session?: Onnx.InferenceSession;
    modelStateH?: Onnx.Tensor;
    modelStateC?: Onnx.Tensor;
    modelSampleRate?: Onnx.Tensor;
    constructor(modelPath: string, executionProviders: OnnxExecutionProvider[]);
    predictAudioFrame(frame: Float32Array): Promise<number>;
    private initializeIfNeeded;
}
