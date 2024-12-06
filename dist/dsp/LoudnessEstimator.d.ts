import { SmoothEstimator } from '../utilities/SmoothEstimator.js';
import { KWeightingFilter } from './KWeightingFilter.js';
export declare class LoudnessEstimator {
    readonly options: LoudnessEstimatorOptions;
    readonly channelFilters: KWeightingFilter[];
    readonly channelMeanSquares: SmoothEstimator[];
    readonly minPower: number;
    constructor(options: LoudnessEstimatorOptions);
    process(sample: number, channel: number): void;
    get currentLoudness(): number;
    getCurrentRMSForChannel(channel: number): number;
}
export interface LoudnessEstimatorOptions {
    sampleRate: number;
    channelCount: number;
    positiveAdaptationRate: number;
    negativeAdaptationRate: number;
    initialEstimate: number;
    minimumLoudness: number;
    applyKWeighting: boolean;
}
