import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { EngineMetadata } from './Common.js';
import { NSNet2Options } from '../denoising/NSNet2.js';
export declare function denoise(input: AudioSourceParam, options: DenoisingOptions): Promise<{
    denoisedAudio: RawAudio;
    inputRawAudio: RawAudio;
}>;
export interface DenoisingResult {
    denoisedAudio: RawAudio;
    inputRawAudio: RawAudio;
}
export type DenoisingEngine = 'rnnoise' | 'nsnet2';
export interface DenoisingOptions {
    engine?: DenoisingEngine;
    postProcessing?: {
        normalizeAudio: boolean;
        targetPeak: number;
        maxGainIncrease: number;
        dryMixGain?: number;
    };
    nsnet2?: NSNet2Options;
}
export declare const defaultDenoisingOptions: DenoisingOptions;
export declare const denoisingEngines: EngineMetadata[];
