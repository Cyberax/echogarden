export declare class DecayingPeakEstimator {
    readonly options: DecayingPeakEstimatorOptions;
    readonly ticksPerSecond: number;
    readonly decayPerTick: number;
    currentPeak: number;
    constructor(options: DecayingPeakEstimatorOptions, ticksPerSecond: number);
    readonly process: (value: number) => void;
    private processMaximum;
    private processMinimum;
}
export interface DecayingPeakEstimatorOptions {
    kind: DecayingPeakEstimatorKind;
    decayPerSecond: number;
    initialPeak: number;
}
export type DecayingPeakEstimatorKind = 'maximum' | 'minimum';
