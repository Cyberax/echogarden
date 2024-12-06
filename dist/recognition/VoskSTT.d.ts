import { Timeline } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
export declare function recognizeFile(filename: string, modelPath: string, verbose?: boolean): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
export declare function recognize(rawAudio: RawAudio, modelPath: string, verbose?: boolean): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
