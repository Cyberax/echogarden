import { ComplexNumber } from '../math/VectorMath.js';
export declare function stftr(samples: Float32Array, fftOrder: number, windowSize: number, hopSize: number, windowType: WindowType): Promise<Float32Array<ArrayBufferLike>[]>;
export declare function stftrGenerator(samples: Float32Array, fftOrder: number, windowSize: number, hopSize: number, windowType: WindowType): AsyncGenerator<Float32Array<ArrayBuffer>, void, unknown>;
export declare function stiftr(binsForFrames: Float32Array[], fftOrder: number, windowSize: number, hopSize: number, windowType: WindowType, expectedOutputLength?: number): Promise<Float32Array<ArrayBuffer>>;
export declare function getBinFrequencies(binCount: number, maxFrequency: number): Float32Array<ArrayBuffer>;
export declare function fftFramesToPowerSpectogram(fftFrames: Float32Array[]): Float32Array<ArrayBuffer>[];
export declare function fftFrameToPowerSpectrum(fftFrame: Float32Array): Float32Array<ArrayBuffer>;
export declare function binBufferToComplex(bins: Float32Array, extendAndMirror?: boolean): ComplexNumber[];
export declare function complexToBinBuffer(complexBins: ComplexNumber[]): Float32Array<ArrayBuffer>;
export declare function complexToMagnitudeAndPhase(real: number, imaginary: number): {
    magnitude: number;
    phase: number;
};
export declare function magnitudeAndPhaseToComplex(magnitude: number, phase: number): ComplexNumber;
export declare function getWindowWeights(windowType: WindowType, windowSize: number): Float32Array<ArrayBuffer>;
export declare function isPffftSimdSupportedForFFTOrder(fftOrder: number): Promise<boolean>;
export declare function getPFFFTInstance(enableSimd: boolean): Promise<any>;
export type WindowType = 'hann' | 'hann-sqrt' | 'hamming' | 'povey';
