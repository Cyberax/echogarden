import * as API from '../api/API.js';
import { MfccOptions } from '../dsp/MFCC.js';
import { Timeline, TimelineEntry } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
import { EspeakEvent, EspeakOptions } from '../synthesis/EspeakTTS.js';
export declare function alignUsingDtw(sourceRawAudio: RawAudio, referenceRawAudio: RawAudio, referenceTimeline: Timeline, granularities: DtwGranularity[], windowDurations: number[]): Promise<TimelineEntry[]>;
export declare function alignUsingDtwWithRecognition(sourceRawAudio: RawAudio, referenceRawAudio: RawAudio, referenceTimeline: Timeline, recognitionTimeline: Timeline, granularities: DtwGranularity[], windowDurations: number[], espeakOptions: EspeakOptions, phoneAlignmentMethod?: API.PhoneAlignmentMethod): Promise<Timeline>;
export declare function alignUsingDtwWithEmbeddings(sourceRawAudio: RawAudio, referenceRawAudio: RawAudio, referenceTimeline: Timeline, language: string, granularities: DtwGranularity[], windowDurations: number[]): Promise<TimelineEntry[]>;
export declare function interpolatePhoneTimelines(sourceTimeline: Timeline, referenceTimeline: Timeline): Promise<Timeline>;
export declare function alignPhoneTimelines(sourceRawAudio: RawAudio, sourceWordTimeline: Timeline, referenceRawAudio: RawAudio, referenceTimeline: Timeline, windowDuration: number): Promise<Timeline>;
export declare function createAlignmentReferenceUsingEspeakForFragments(fragments: string[], espeakOptions: EspeakOptions): Promise<{
    rawAudio: RawAudio;
    timeline: Timeline;
    events: EspeakEvent[];
}>;
export declare function createAlignmentReferenceUsingEspeak(transcript: string, language: string, plaintextOptions?: API.PlainTextOptions, customLexiconPaths?: string[], insertSeparators?: boolean, useKlatt?: boolean): Promise<{
    referenceRawAudio: RawAudio;
    referenceTimeline: TimelineEntry[];
    espeakVoice: string;
}>;
export declare function getMfccOptionsForGranularity(granularity: DtwGranularity): MfccOptions;
export type AlignmentPath = AlignmentPathEntry[];
export type AlignmentPathEntry = {
    source: number;
    dest: number;
};
export type CompactedPath = CompactedPathEntry[];
export type CompactedPathEntry = {
    first: number;
    last: number;
};
export type DtwGranularity = 'xx-low' | 'x-low' | 'low' | 'medium' | 'high' | 'x-high';
