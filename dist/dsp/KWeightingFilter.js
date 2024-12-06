import { BiquadFilter, createHighpassFilter, createHighshelfFilter } from './BiquadFilter.js';
export class KWeightingFilter {
    sampleRate;
    useStandard44100Filters;
    highShelfFilter;
    highPassFilter;
    constructor(sampleRate, useStandard44100Filters = false) {
        this.sampleRate = sampleRate;
        this.useStandard44100Filters = useStandard44100Filters;
        if (useStandard44100Filters) {
            // These parameter values are taken from ITU-R BS.1770-2
            // and designed only for a 44100 Hz sample rate:
            this.highShelfFilter = new BiquadFilter({
                b0: 1.53512485958697,
                b1: -2.69169618940638,
                b2: 1.19839281085285,
                a1: -1.69065929318241,
                a2: 0.73248077421585,
            });
            this.highPassFilter = new BiquadFilter({
                b0: 1.0,
                b1: -2.0,
                b2: 1.0,
                a1: -1.99004745483398,
                a2: 0.99007225036621,
            });
        }
        else {
            this.highShelfFilter = createHighshelfFilter(sampleRate, 2000.0, 4.0);
            this.highPassFilter = createHighpassFilter(sampleRate, 1.5, 0.01);
        }
    }
    process(sample) {
        let outputSample = sample;
        outputSample = this.highShelfFilter.filter(outputSample);
        outputSample = this.highPassFilter.filter(outputSample);
        return outputSample;
    }
}
//# sourceMappingURL=KWeightingFilter.js.map