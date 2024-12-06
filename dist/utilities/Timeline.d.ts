import { ParagraphBreakType, WhitespaceProcessing } from '../api/Common.js';
export declare function addTimeOffsetToTimeline(targetTimeline: Timeline, timeOffset: number): Timeline;
export declare function multiplyTimelineByFactor(targetTimeline: Timeline, factor: number): Timeline;
export declare function roundTimelineProperties(targetTimeline: Timeline, decimalDigits?: number): Timeline;
export declare function wordTimelineToSegmentSentenceTimeline(wordTimeline: Timeline, transcript: string, language: string, paragraphBreaks?: ParagraphBreakType, whitespace?: WhitespaceProcessing): Promise<{
    segmentTimeline: Timeline;
}>;
export declare function addWordTextOffsetsToTimeline(timeline: Timeline, text: string, currentOffset?: number): number;
export declare function extractEntries(timeline: Timeline, predicate: (entry: TimelineEntry) => boolean): TimelineEntry[];
export type TimelineEntryType = 'segment' | 'paragraph' | 'sentence' | 'clause' | 'phrase' | 'word' | 'token' | 'letter' | 'phone' | 'subphone';
export type TimelineEntry = {
    type: TimelineEntryType;
    text: string;
    startTime: number;
    endTime: number;
    startOffsetUtf16?: number;
    endOffsetUtf16?: number;
    startOffsetUtf32?: number;
    endOffsetUtf32?: number;
    confidence?: number;
    id?: number;
    timeline?: Timeline;
};
export type Timeline = TimelineEntry[];
export declare function testTimelineFix(): Promise<void>;
