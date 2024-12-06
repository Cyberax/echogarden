import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { Timeline } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
export declare function synthesize(text: string, subscriptionKey: string, serviceRegion: string, languageCode?: string, voice?: string, ssmlEnabled?: boolean, ssmlPitchString?: string, ssmlRateString?: string): Promise<{
    rawAudio: RawAudio;
    timeline: Timeline;
}>;
export declare function getVoiceList(subscriptionKey: string, serviceRegion: string): Promise<SpeechSDK.VoiceInfo[]>;
export declare function boundaryEventsToTimeline(events: any[], totalDuration: number): Timeline;
