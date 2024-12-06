import { RawAudio } from '../audio/AudioUtilities.js';
export declare function synthesize(text: string, pitch?: number, speed?: number, mouth?: number, throat?: number): Promise<{
    rawAudio: RawAudio;
}>;
