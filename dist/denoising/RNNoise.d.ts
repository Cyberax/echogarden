import { RawAudio } from '../audio/AudioUtilities.js';
export declare function denoiseAudio(rawAudio: RawAudio): Promise<{
    denoisedRawAudio: RawAudio;
    frameVadProbabilities: number[];
}>;
export declare function getRnnoiseInstance(): Promise<any>;
