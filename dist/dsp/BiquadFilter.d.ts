export declare function createLowpassFilter(sampleRate: number, cutoffFrequency: number, q?: number): BiquadFilter;
export declare function createHighpassFilter(sampleRate: number, cutoffFrequency: number, q?: number): BiquadFilter;
export declare function createBandpassFilter(sampleRate: number, centerFrequency: number, q?: number): BiquadFilter;
export declare function createLowshelfFilter(sampleRate: number, midpointFrequency: number, gain: number): BiquadFilter;
export declare function createHighshelfFilter(sampleRate: number, midpointFrequency: number, gain: number): BiquadFilter;
export declare function createPeakingFilter(sampleRate: number, centerFrequency: number, q?: number, gain?: number): BiquadFilter;
export declare function createNotchFilter(sampleRate: number, centerFrequency: number, q?: number): BiquadFilter;
export declare function createAllpassFilter(sampleRate: number, centerFrequency: number, q?: number): BiquadFilter;
export declare function createFilter(filterType: FilterType, sampleRate: number, frequency: number, q: number, gain: number): BiquadFilter;
export declare class BiquadFilter {
    private b0;
    private b1;
    private b2;
    private a1;
    private a2;
    private prevInput1;
    private prevInput2;
    private prevOutput1;
    private prevOutput2;
    constructor(coefficients: FilterCoefficients);
    filter(sample: number): number;
    filterSamplesInPlace(samples: Float32Array): void;
    reset(): void;
    setCoefficients(coefficients: FilterCoefficients): void;
}
export declare function getFilterCoefficients(filterType: FilterType, sampleRate: number, centerFrequency: number, q: number, gain: number): FilterCoefficients;
export declare function getLowpassFilterCoefficients(freqRatio: number, q: number, gain: number): FilterCoefficients;
export declare function bandwidthToQFactor(bandwidth: number): number;
export declare function qFactorToBandwidth(q: number): number;
export declare function clamp(num: number, min: number, max: number): number;
export declare const filterTypeName: {
    [name in FilterType]: string;
};
export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch' | 'allpass';
export type FilterCoefficients = {
    b0: number;
    b1: number;
    b2: number;
    a1: number;
    a2: number;
};
export declare const emptyBiquadCoefficients: FilterCoefficients;
