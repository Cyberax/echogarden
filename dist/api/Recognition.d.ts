import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import * as API from './API.js';
import { Timeline } from '../utilities/Timeline.js';
import { type WhisperOptions } from '../recognition/WhisperSTT.js';
import { type SubtitlesConfig } from '../subtitles/Subtitles.js';
import { type OpenAICloudSTTOptions } from '../recognition/OpenAICloudSTT.js';
import { type WhisperCppOptions } from '../recognition/WhisperCppSTT.js';
import { type SileroRecognitionOptions } from '../recognition/SileroSTT.js';
export declare function recognize(input: AudioSourceParam, options: RecognitionOptions): Promise<RecognitionResult>;
export interface RecognitionResult {
    transcript: string;
    timeline: Timeline;
    wordTimeline: Timeline;
    language: string;
    inputRawAudio: RawAudio;
    isolatedRawAudio?: RawAudio;
    backgroundRawAudio?: RawAudio;
}
export type RecognitionEngine = 'whisper' | 'whisper.cpp' | 'vosk' | 'silero' | 'google-cloud' | 'microsoft-azure' | 'amazon-transcribe' | 'openai-cloud';
export interface RecognitionOptions {
    engine?: RecognitionEngine;
    language?: string;
    maxAlternatives?: number;
    isolate?: boolean;
    crop?: boolean;
    alignment?: API.AlignmentOptions;
    languageDetection?: API.SpeechLanguageDetectionOptions;
    subtitles?: SubtitlesConfig;
    vad?: API.VADOptions;
    sourceSeparation?: API.SourceSeparationOptions;
    whisper?: WhisperOptions;
    whisperCpp?: WhisperCppOptions;
    vosk?: {
        modelPath?: string;
    };
    silero?: SileroRecognitionOptions;
    googleCloud?: {
        apiKey?: string;
        alternativeLanguageCodes?: string[];
        profanityFilter?: boolean;
        autoPunctuation?: boolean;
        useEnhancedModel?: boolean;
    };
    microsoftAzure?: {
        subscriptionKey?: string;
        serviceRegion?: string;
    };
    amazonTranscribe?: {
        region?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    openAICloud?: OpenAICloudSTTOptions;
}
export declare const defaultRecognitionOptions: RecognitionOptions;
export declare const recognitionEngines: API.EngineMetadata[];
