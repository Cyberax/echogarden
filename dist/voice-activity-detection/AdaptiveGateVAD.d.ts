import { RawAudio } from '../audio/AudioUtilities.js';
import { BiquadFilter } from '../dsp/BiquadFilter.js';
import { DecayingPeakEstimator } from '../dsp/DecayingPeakEstimator.js';
import { LoudnessEstimator } from '../dsp/LoudnessEstimator.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function detectVoiceActivity(rawAudio: RawAudio, options: AdaptiveGateVADOptions): Promise<Timeline>;
export declare class AdaptiveGateVAD {
    readonly sampleRate: number;
    readonly channelCount: number;
    readonly options: AdaptiveGateVADOptions;
    channelHighpassFilters: BiquadFilter[];
    channelLowpassFilters: BiquadFilter[];
    loudnessEstimator: LoudnessEstimator;
    minimumLoudnessEstimator: DecayingPeakEstimator;
    maximumLoudnessEstimator: DecayingPeakEstimator;
    constructor(sampleRate: number, channelCount: number, options: AdaptiveGateVADOptions);
    process(sample: number, channelIndex: number): void;
}
export interface AdaptiveGateVADOptions {
    lowCutoff?: number;
    highCutoff?: number;
    positiveAdaptationRate?: number;
    negativeAdaptationRate?: number;
    peakLoudnessDecay?: number;
    backwardExtensionDuration?: number;
    relativeThreshold?: number;
}
export declare const defaultAdaptiveGateOptions: AdaptiveGateVADOptions;
