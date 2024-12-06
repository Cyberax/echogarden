export class SmoothEstimator {
    positiveAdaptationRate;
    negativeAdaptationRate;
    estimate;
    constructor(positiveAdaptationRate, negativeAdaptationRate, initialEstimate = 0.0) {
        this.positiveAdaptationRate = positiveAdaptationRate;
        this.negativeAdaptationRate = negativeAdaptationRate;
        this.estimate = initialEstimate;
    }
    update(target, adaptaionRateFactor = 1.0) {
        const residual = target - this.estimate;
        const adaptationRate = residual >= 0 ? this.positiveAdaptationRate : this.negativeAdaptationRate;
        const stepSize = residual * adaptationRate * adaptaionRateFactor;
        this.estimate += stepSize;
    }
    updateDamped(target, dampingReference, dampingCurvature, adaptationRateFactor = 1.0) {
        const residual = target - this.estimate;
        const scaledResidualMagnitude = Math.abs(residual) * dampingCurvature;
        const dampingFactor = (scaledResidualMagnitude) / (scaledResidualMagnitude + dampingReference);
        const adaptationRate = residual >= 0 ? this.positiveAdaptationRate : this.negativeAdaptationRate;
        const stepSize = residual * adaptationRate * adaptationRateFactor * dampingFactor;
        this.estimate += stepSize;
    }
}
//# sourceMappingURL=SmoothEstimator.js.map