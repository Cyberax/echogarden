export declare class SmoothEstimator {
    readonly positiveAdaptationRate: number;
    readonly negativeAdaptationRate: number;
    estimate: number;
    constructor(positiveAdaptationRate: number, negativeAdaptationRate: number, initialEstimate?: number);
    update(target: number, adaptaionRateFactor?: number): void;
    updateDamped(target: number, dampingReference: number, dampingCurvature: number, adaptationRateFactor?: number): void;
}
