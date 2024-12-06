import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import * as API from './API.js';
import { Timeline } from '../utilities/Timeline.js';
import { type WhisperAlignmentOptions } from '../recognition/WhisperSTT.js';
import { DtwGranularity } from '../alignment/SpeechAlignment.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
export declare function align(input: AudioSourceParam, transcript: string, options: AlignmentOptions): Promise<AlignmentResult>;
export declare function alignSegments(sourceRawAudio: RawAudio, segmentTimeline: Timeline, alignmentOptions: AlignmentOptions): Promise<Timeline>;
export interface AlignmentResult {
    timeline: Timeline;
    wordTimeline: Timeline;
    transcript: string;
    language: string;
    inputRawAudio: RawAudio;
    isolatedRawAudio?: RawAudio;
    backgroundRawAudio?: RawAudio;
}
export type AlignmentEngine = 'dtw' | 'dtw-ra' | 'dtw-ea' | 'whisper';
export type PhoneAlignmentMethod = 'interpolation' | 'dtw';
export interface AlignmentOptions {
    engine?: AlignmentEngine;
    language?: string;
    isolate?: boolean;
    crop?: boolean;
    customLexiconPaths?: string[];
    languageDetection?: API.TextLanguageDetectionOptions;
    vad?: API.VADOptions;
    plainText?: API.PlainTextOptions;
    subtitles?: SubtitlesConfig;
    dtw?: {
        granularity?: DtwGranularity | DtwGranularity[];
        windowDuration?: number | string | (string | number)[];
        phoneAlignmentMethod?: PhoneAlignmentMethod;
    };
    recognition?: API.RecognitionOptions;
    sourceSeparation?: API.SourceSeparationOptions;
    whisper?: WhisperAlignmentOptions;
}
export declare const defaultAlignmentOptions: AlignmentOptions;
export declare const alignmentEngines: API.EngineMetadata[];
