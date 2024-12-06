import { RawAudio } from '../audio/AudioUtilities.js';
import { type RubberbandOptions } from '../dsp/Rubberband.js';
import * as API from './API.js';
import { Timeline } from '../utilities/Timeline.js';
import { EngineMetadata } from './Common.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
import { type OpenAICloudTTSOptions } from '../synthesis/OpenAICloudTTS.js';
import { type ElevenlabsTTSOptions } from '../synthesis/ElevenlabsTTS.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
export declare function synthesize(input: string | string[], options: SynthesisOptions, onSegment?: SynthesisSegmentEvent, onSentence?: SynthesisSegmentEvent): Promise<SynthesisResult>;
export interface SynthesisResult {
    audio: RawAudio | Uint8Array;
    timeline: Timeline;
    language: string;
    voice: string;
}
export type SynthesisEngine = 'vits' | 'pico' | 'flite' | 'espeak' | 'sam' | 'sapi' | 'msspeech' | 'coqui-server' | 'google-cloud' | 'microsoft-azure' | 'amazon-polly' | 'openai-cloud' | 'elevenlabs' | 'google-translate' | 'microsoft-edge' | 'streamlabs-polly';
export type TimePitchShiftingMethod = 'sonic' | 'rubberband';
export interface SynthesisOptions {
    engine?: SynthesisEngine;
    language?: string;
    voice?: string;
    voiceGender?: VoiceGender;
    speed?: number;
    pitch?: number;
    pitchVariation?: number;
    splitToSentences?: boolean;
    ssml?: boolean;
    segmentEndPause?: number;
    sentenceEndPause?: number;
    customLexiconPaths?: string[];
    plainText?: API.PlainTextOptions;
    alignment?: API.AlignmentOptions;
    postProcessing?: {
        normalizeAudio?: boolean;
        targetPeak?: number;
        maxGainIncrease?: number;
        speed?: number;
        pitch?: number;
        timePitchShiftingMethod?: TimePitchShiftingMethod;
        rubberband?: RubberbandOptions;
    };
    outputAudioFormat?: {
        codec?: 'wav' | 'mp3' | 'opus' | 'm4a' | 'ogg' | 'flac';
        bitrate?: number;
    };
    languageDetection?: API.TextLanguageDetectionOptions;
    subtitles?: SubtitlesConfig;
    vits?: {
        speakerId?: number;
        provider?: OnnxExecutionProvider;
    };
    pico?: {};
    flite?: {};
    espeak?: {
        rate?: number;
        pitch?: number;
        pitchRange?: number;
        useKlatt?: boolean;
        insertSeparators?: boolean;
    };
    sam?: {
        pitch?: number;
        speed?: number;
        mouth?: number;
        throat?: number;
    };
    sapi?: {
        rate?: number;
    };
    msspeech?: {
        rate?: number;
    };
    coquiServer?: {
        serverUrl?: string;
        speakerId?: string | null;
    };
    googleCloud?: {
        apiKey?: string;
        pitchDeltaSemitones?: number;
        customVoice?: {
            model?: string;
            reportedUsage?: string;
        };
    };
    microsoftAzure?: {
        subscriptionKey?: string;
        serviceRegion?: string;
        pitchDeltaHz?: number;
    };
    amazonPolly?: {
        region?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
        pollyEngine?: 'standard' | 'neural';
        lexiconNames?: string[];
    };
    openAICloud?: OpenAICloudTTSOptions;
    elevenlabs?: ElevenlabsTTSOptions;
    googleTranslate?: {
        tld?: string;
    };
    microsoftEdge?: {
        trustedClientToken?: string;
        pitchDeltaHz?: number;
    };
    streamlabsPolly?: {};
}
export declare const defaultSynthesisOptions: SynthesisOptions;
export declare function requestVoiceList(options: VoiceListRequestOptions): Promise<RequestVoiceListResult>;
export interface RequestVoiceListResult {
    voiceList: API.SynthesisVoice[];
    bestMatchingVoice: API.SynthesisVoice;
}
export declare function selectBestOfflineEngineForLanguage(language: string): Promise<SynthesisEngine>;
export declare function getAllLangCodesFromVoiceList(voiceList: SynthesisVoice[]): string[];
export interface VoiceListRequestOptions extends SynthesisOptions {
    cache?: {
        path?: string;
        duration?: number;
    };
}
export declare const defaultVoiceListRequestOptions: VoiceListRequestOptions;
export interface SynthesisSegmentEventData {
    index: number;
    total: number;
    audio: RawAudio | Uint8Array;
    timeline: Timeline;
    transcript: string;
    language: string;
    peakDecibelsSoFar: number;
}
export type SynthesisSegmentEvent = (data: SynthesisSegmentEventData) => Promise<void>;
export interface SynthesisVoice {
    name: string;
    languages: string[];
    gender: VoiceGender;
    speakerCount?: number;
    packageName?: string;
}
export type VoiceGender = 'male' | 'female' | 'unknown';
export declare const synthesisEngines: EngineMetadata[];
