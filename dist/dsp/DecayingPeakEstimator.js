export class DecayingPeakEstimator {
    options;
    ticksPerSecond;
    decayPerTick;
    currentPeak;
    constructor(options, ticksPerSecond) {
        this.options = options;
        this.ticksPerSecond = ticksPerSecond;
        this.currentPeak = options.initialPeak;
        this.decayPerTick = this.options.decayPerSecond / this.ticksPerSecond;
        this.process = options.kind === 'maximum' ? this.processMaximum : this.processMinimum;
    }
    process;
    processMaximum(value) {
        this.currentPeak -= this.decayPerTick;
        this.currentPeak = Math.max(value, this.currentPeak);
    }
    processMinimum(value) {
        this.currentPeak += this.decayPerTick;
        this.currentPeak = Math.min(value, this.currentPeak);
    }
}
//# sourceMappingURL=DecayingPeakEstimator.js.map