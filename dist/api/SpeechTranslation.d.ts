import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { Timeline } from '../utilities/Timeline.js';
import { type WhisperOptions } from '../recognition/WhisperSTT.js';
import { EngineMetadata } from './Common.js';
import { type SpeechLanguageDetectionOptions } from './API.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
import * as API from './API.js';
import { type OpenAICloudSTTOptions } from '../recognition/OpenAICloudSTT.js';
import { type WhisperCppOptions } from '../recognition/WhisperCppSTT.js';
export declare function translateSpeech(input: AudioSourceParam, options: SpeechTranslationOptions): Promise<SpeechTranslationResult>;
export interface SpeechTranslationResult {
    transcript: string;
    timeline: Timeline;
    wordTimeline?: Timeline;
    sourceLanguage: string;
    targetLanguage: string;
    inputRawAudio: RawAudio;
    isolatedRawAudio?: RawAudio;
    backgroundRawAudio?: RawAudio;
}
export type SpeechTranslationEngine = 'whisper' | 'whisper.cpp' | 'openai-cloud';
export interface SpeechTranslationOptions {
    engine?: SpeechTranslationEngine;
    sourceLanguage?: string;
    targetLanguage?: string;
    crop?: boolean;
    isolate?: boolean;
    languageDetection?: SpeechLanguageDetectionOptions;
    subtitles?: SubtitlesConfig;
    vad?: API.VADOptions;
    sourceSeparation?: API.SourceSeparationOptions;
    whisper?: WhisperOptions;
    whisperCpp?: WhisperCppOptions;
    openAICloud?: OpenAICloudSTTOptions;
}
export declare const defaultSpeechTranslationOptions: SpeechTranslationOptions;
export declare const speechTranslationEngines: EngineMetadata[];
