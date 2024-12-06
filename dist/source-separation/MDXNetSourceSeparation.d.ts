import type * as Onnx from 'onnxruntime-node';
import { RawAudio } from '../audio/AudioUtilities.js';
import { WindowType } from '../dsp/FFT.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function isolate(rawAudio: RawAudio, modelFilePath: string, modelProfile: MDXNetModelProfile, options: MDXNetOptions): Promise<RawAudio>;
export declare class MDXNet {
    readonly modelFilePath: string;
    readonly modelProfile: MDXNetModelProfile;
    readonly options: MDXNetOptions;
    session?: Onnx.InferenceSession;
    onnxSessionOptions?: Onnx.InferenceSession.SessionOptions;
    constructor(modelFilePath: string, modelProfile: MDXNetModelProfile, options: MDXNetOptions);
    processAudio(rawAudio: RawAudio): Promise<RawAudio>;
    private initializeSessionIfNeeded;
}
export declare function getDefaultMDXNetProviders(): OnnxExecutionProvider[];
export declare function getProfileForMDXNetModelName(modelName: MDXNetModelName): MDXNetModelProfile;
export declare const mdxNetModelProfile1: MDXNetModelProfile;
export declare const mdxNetModelProfile2: MDXNetModelProfile;
export interface MDXNetModelProfile {
    sampleRate: number;
    fftSize: number;
    fftWindowSize: number;
    fftHopSize: number;
    fftWindowType: WindowType;
    binCount: number;
    segmentSize: number;
    segmentHopSize: number;
}
export type MDXNetModelName = 'UVR_MDXNET_1_9703' | 'UVR_MDXNET_2_9682' | 'UVR_MDXNET_3_9662' | 'UVR_MDXNET_KARA' | 'UVR_MDXNET_Main' | 'Kim_Vocal_1' | 'Kim_Vocal_2';
export interface MDXNetOptions {
    model?: MDXNetModelName;
    provider?: OnnxExecutionProvider;
}
export declare const defaultMDXNetOptions: MDXNetOptions;
