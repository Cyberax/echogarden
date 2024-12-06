import { Timeline } from '../utilities/Timeline.js';
export declare function subtitlesFileToText(filename: string): Promise<string>;
export declare function subtitlesToText(subtitles: string): string;
export declare function subtitlesToTimeline(subtitles: string, removeMarkup?: boolean): Timeline;
export declare function timelineToSubtitles(timeline: Timeline, subtitlesConfig?: SubtitlesConfig): string;
export declare function tryParseTimeRangePatternWithHours(line: string): {
    startTime: number;
    endTime: number;
    succeeded: boolean;
};
export declare function tryParseTimeRangePatternWithoutHours(line: string): {
    startTime: number;
    endTime: number;
    succeeded: boolean;
};
export type Cue = {
    lines: string[];
    startTime: number;
    endTime: number;
};
export type SubtitlesMode = 'line' | 'segment' | 'sentence' | 'word' | 'phone' | 'word+phone';
export interface SubtitlesConfig {
    format?: 'srt' | 'webvtt';
    language?: string;
    mode?: SubtitlesMode;
    maxLineCount?: number;
    maxLineWidth?: number;
    minWordsInLine?: number;
    separatePhrases?: boolean;
    maxAddedDuration?: number;
    decimalSeparator?: ',' | '.';
    includeCueIndexes?: boolean;
    includeHours?: boolean;
    lineBreakString?: '\n' | '\r\n';
    originalText?: string;
    totalDuration?: number;
}
export declare const defaultSubtitlesBaseConfig: SubtitlesConfig;
export declare const srtConfigExtension: SubtitlesConfig;
export declare const webVttConfigExtension: SubtitlesConfig;
