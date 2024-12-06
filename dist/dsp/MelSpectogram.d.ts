import { RawAudio } from '../audio/AudioUtilities.js';
import * as FFT from './FFT.js';
export declare function computeMelSpectogram(rawAudio: RawAudio, fftOrder: number, windowSize: number, hopLength: number, filterbankCount: number, lowerFrequencyHz: number, upperFrequencyHz: number, windowType?: FFT.WindowType): Promise<{
    melSpectogram: Float32Array<ArrayBuffer>[];
    fftFrames: Float32Array<ArrayBufferLike>[];
}>;
export declare function computeMelSpectogramUsingFilterbanks(rawAudio: RawAudio, fftOrder: number, windowSize: number, hopLength: number, filterbanks: Filterbank[], windowType?: FFT.WindowType): Promise<{
    melSpectogram: Float32Array<ArrayBuffer>[];
    fftFrames: Float32Array<ArrayBufferLike>[];
}>;
export declare function fftFramesToMelSpectogram(fftFrames: Float32Array[], melFilterbanks: Filterbank[]): Float32Array<ArrayBuffer>[];
export declare function powerSpectrumToMelSpectrum(powerSpectrum: Float32Array, filterbanks: Filterbank[]): Float32Array<ArrayBuffer>;
export declare function getMelFilterbanks(powerSpectrumFrequenciesHz: Float32Array, centerFrequenciesMel: Float32Array, lowerFrequencyMel: number, upperFrequencyMel: number): Filterbank[];
export declare function getMelFilterbanksCenterFrequencies(melBandCount: number, lowerFrequencyMel: number, upperFrequencyMel: number): Float32Array<ArrayBuffer>;
export declare function hertzToMel(frequency: number): number;
export declare function melToHertz(mel: number): number;
export type Filterbank = {
    startIndex: number;
    weights: number[];
};
