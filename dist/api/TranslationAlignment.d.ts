import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import * as API from './API.js';
import { Timeline } from '../utilities/Timeline.js';
import { type WhisperAlignmentOptions } from '../recognition/WhisperSTT.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
export declare function alignTranslation(input: AudioSourceParam, translatedTranscript: string, options: TranslationAlignmentOptions): Promise<TranslationAlignmentResult>;
export interface TranslationAlignmentResult {
    timeline: Timeline;
    wordTimeline: Timeline;
    translatedTranscript: string;
    sourceLanguage: string;
    targetLanguage: string;
    inputRawAudio: RawAudio;
    isolatedRawAudio?: RawAudio;
    backgroundRawAudio?: RawAudio;
}
export type TranslationAlignmentEngine = 'whisper';
export interface TranslationAlignmentOptions {
    engine?: TranslationAlignmentEngine;
    sourceLanguage?: string;
    targetLanguage?: string;
    isolate?: boolean;
    crop?: boolean;
    languageDetection?: API.SpeechLanguageDetectionOptions;
    vad?: API.VADOptions;
    plainText?: API.PlainTextOptions;
    subtitles?: SubtitlesConfig;
    sourceSeparation?: API.SourceSeparationOptions;
    whisper?: WhisperAlignmentOptions;
}
export declare const defaultTranslationAlignmentOptions: TranslationAlignmentOptions;
export declare const translationAlignmentEngines: API.EngineMetadata[];
