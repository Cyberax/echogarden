import type * as Onnx from 'onnxruntime-node';
export declare function getOnnxSessionOptions(options: OnnxSessionOptions): Onnx.InferenceSession.SessionOptions;
export declare function makeOnnxLikeFloat32Tensor(onnxTensor: Onnx.Tensor): OnnxLikeFloat32Tensor;
export declare function dmlProviderAvailable(): boolean;
export interface OnnxLikeFloat32Tensor {
    readonly data: Float32Array;
    readonly dims: number[];
}
export interface OnnxSessionOptions {
    enableGPU?: boolean;
    executionProviders?: OnnxExecutionProvider[];
    logSeverityLevel?: 0 | 1 | 2 | 3 | 4;
}
export type OnnxExecutionProvider = 'cpu' | 'dml' | 'cuda';
