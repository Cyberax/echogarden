import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import * as API from './API.js';
import { Timeline } from '../utilities/Timeline.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
export declare function alignTranscriptAndTranslation(input: AudioSourceParam, transcript: string, translatedTranscript: string, options: TranscriptAndTranslationAlignmentOptions): Promise<TranscriptAndTranslationAlignmentResult>;
export interface TranscriptAndTranslationAlignmentResult {
    timeline: Timeline;
    wordTimeline: Timeline;
    translatedTimeline: Timeline;
    translatedWordTimeline: Timeline;
    transcript: string;
    translatedTranscript: string;
    sourceLanguage: string;
    targetLanguage: string;
    inputRawAudio: RawAudio;
    isolatedRawAudio?: RawAudio;
    backgroundRawAudio?: RawAudio;
}
export type TranscriptAndTranslationAlignmentEngine = 'two-stage';
export interface TranscriptAndTranslationAlignmentOptions {
    engine?: TranscriptAndTranslationAlignmentEngine;
    sourceLanguage?: string;
    targetLanguage?: string;
    isolate?: boolean;
    crop?: boolean;
    alignment?: API.AlignmentOptions;
    timelineAlignment?: API.TimelineTranslationAlignmentOptions;
    languageDetection?: API.TextLanguageDetectionOptions;
    vad?: API.VADOptions;
    plainText?: API.PlainTextOptions;
    subtitles?: SubtitlesConfig;
    sourceSeparation?: API.SourceSeparationOptions;
}
export declare const defaultTranscriptAndTranslationAlignmentOptions: TranscriptAndTranslationAlignmentOptions;
export declare const TranscriptAndTranslationAlignmentEngines: API.EngineMetadata[];
