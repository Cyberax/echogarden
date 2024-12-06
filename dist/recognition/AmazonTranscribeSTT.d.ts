import { Timeline } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
export declare function recgonize(rawAudio: RawAudio, languageCode: string, region: string, accessKeyId: string, secretAccessKey: string): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
