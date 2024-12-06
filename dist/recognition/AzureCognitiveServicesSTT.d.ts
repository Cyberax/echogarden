import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { RawAudio } from '../audio/AudioUtilities.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function recognize(rawAudio: RawAudio, subscriptionKey: string, serviceRegion: string, languageCode: string, profanity?: SpeechSDK.ProfanityOption): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
