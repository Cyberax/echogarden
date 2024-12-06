import { RawAudio } from '../audio/AudioUtilities.js';
export declare function detectVoiceActivity(rawAudio: RawAudio, frameDuration?: 10 | 20 | 30, mode?: 0 | 1 | 2 | 3): Promise<(0 | 1)[]>;
export declare function fvad(samples: Int16Array, sampleRate: number, frameDuration: 10 | 20 | 30, mode: 0 | 1 | 2 | 3): Promise<any[]>;
