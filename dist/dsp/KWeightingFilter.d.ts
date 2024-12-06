import { BiquadFilter } from './BiquadFilter.js';
export declare class KWeightingFilter {
    readonly sampleRate: number;
    readonly useStandard44100Filters: boolean;
    readonly highShelfFilter: BiquadFilter;
    readonly highPassFilter: BiquadFilter;
    constructor(sampleRate: number, useStandard44100Filters?: boolean);
    process(sample: number): number;
}
