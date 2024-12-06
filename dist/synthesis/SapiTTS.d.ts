import { SynthesisVoice } from '../api/API.js';
import { RawAudio } from '../audio/AudioUtilities.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function synthesize(text: string, voiceName: string, rate?: number, useSpeechPlatform?: boolean): Promise<{
    rawAudio: RawAudio;
    timeline: Timeline;
}>;
export declare function getVoiceList(useSpeechPlatform?: boolean): Promise<SynthesisVoice[]>;
export declare function AssertSAPIAvailable(testForSpeechPlatform?: boolean): Promise<void>;
