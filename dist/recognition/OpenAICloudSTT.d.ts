import { RawAudio } from '../audio/AudioUtilities.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function recognize(rawAudio: RawAudio, languageCode: string, options: OpenAICloudSTTOptions, task?: Task): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
type Task = 'transcribe' | 'translate';
export interface OpenAICloudSTTOptions {
    model?: 'whisper-1' | string;
    apiKey?: string;
    organization?: string;
    baseURL?: string;
    temperature?: number;
    prompt?: string;
    timeout?: number;
    maxRetries?: number;
    requestWordTimestamps?: boolean;
}
export declare const defaultOpenAICloudSTTOptions: OpenAICloudSTTOptions;
export {};
