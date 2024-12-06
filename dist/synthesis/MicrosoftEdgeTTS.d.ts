import WebSocket from 'ws';
import { RawAudio } from '../audio/AudioUtilities.js';
export declare function synthesize(text: string, trustedClientToken: string, voice?: string, ssmlPitchString?: string, ssmlRateString?: string, ssmlVolumeString?: string): Promise<{
    rawAudio: RawAudio;
    timeline: import("../utilities/Timeline.js").Timeline;
}>;
export declare function initializeWebsocketConnection(trustedClientToken: string): Promise<WebSocket>;
export declare function getVoiceList(trustedClientToken: string): Promise<any[]>;
