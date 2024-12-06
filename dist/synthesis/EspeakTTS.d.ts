import { RawAudio } from '../audio/AudioUtilities.js';
import { Lexicon } from '../nlp/Lexicon.js';
import { Timeline } from '../utilities/Timeline.js';
export declare function preprocessAndSynthesize(text: string, language: string, espeakOptions: EspeakOptions, lexicons?: Lexicon[]): Promise<{
    referenceSynthesizedAudio: RawAudio;
    referenceTimeline: Timeline;
    fragments: string[];
    preprocessedFragments: string[];
    phonemizedFragmentsSubstitutions: Map<number, string[]>;
    phonemizedSentence: string[][][];
}>;
export declare function synthesizeFragments(fragments: string[], espeakOptions: EspeakOptions): Promise<{
    rawAudio: RawAudio;
    timeline: Timeline;
    events: EspeakEvent[];
}>;
export declare function synthesize(text: string, espeakOptions: EspeakOptions): Promise<{
    rawAudio: RawAudio;
    events: EspeakEvent[];
}>;
export declare function textToIPA(text: string, voice: string): Promise<string>;
export declare function textToPhonemes(text: string, voice: string, useIPA?: boolean): Promise<string>;
export declare function setVoice(voiceId: string): Promise<void>;
export declare function setVolume(volume: number): Promise<any>;
export declare function setRate(rate: number): Promise<any>;
export declare function setPitch(pitch: number): Promise<any>;
export declare function setPitchRange(pitchRange: number): Promise<any>;
export declare function getSampleRate(): Promise<22050>;
export declare function listVoices(): Promise<{
    identifier: string;
    name: string;
    languages: {
        priority: number;
        name: string;
    }[];
}[]>;
export type EspeakEventType = 'sentence' | 'word' | 'phoneme' | 'end' | 'mark' | 'play' | 'msg_terminated' | 'list_terminated' | 'samplerate';
export interface EspeakEvent {
    audio_position: number;
    type: EspeakEventType;
    text_position: number;
    word_length: number;
    id?: string | number;
}
export interface EspeakOptions {
    voice: string;
    ssml: boolean;
    rate: number;
    pitch: number;
    pitchRange: number;
    useKlatt: boolean;
    insertSeparators: boolean;
}
export declare const defaultEspeakOptions: EspeakOptions;
export declare function testKirshenbaumPhonemization(text: string): Promise<void>;
