import { AudioSourceParam } from "../audio/AudioUtilities.js";
export declare function searchSpeech(inputAudio: AudioSourceParam, text: string, options: SpeechSearchOptions): Promise<SpeechSearchResult>;
export interface SpeechSearchOptions {
}
export interface SpeechSearchResult {
}
