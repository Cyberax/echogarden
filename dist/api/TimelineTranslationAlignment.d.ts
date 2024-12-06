import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { SubtitlesConfig } from '../subtitles/Subtitles.js';
import { Timeline } from '../utilities/Timeline.js';
import * as API from './API.js';
export declare function alignTimelineTranslation(inputTimeline: Timeline, translatedTranscript: string, options: TimelineTranslationAlignmentOptions): Promise<TimelineTranslationAlignmentResult>;
export interface TimelineTranslationAlignmentResult {
    timeline: Timeline;
    wordTimeline: Timeline;
    sourceLanguage?: string;
    targetLanguage: string;
    rawAudio?: RawAudio;
}
export interface TimelineTranslationAlignmentOptions {
    engine?: 'e5';
    sourceLanguage?: string;
    targetLanguage?: string;
    audio?: AudioSourceParam;
    languageDetection?: API.TextLanguageDetectionOptions;
    subtitles?: SubtitlesConfig;
    e5?: {
        model: 'small-fp16';
    };
}
