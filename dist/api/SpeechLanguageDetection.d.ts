import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import * as API from './API.js';
import { type WhisperLanguageDetectionOptions } from '../recognition/WhisperSTT.js';
import { type WhisperCppOptions } from '../recognition/WhisperCppSTT.js';
import { type SileroLanguageDetectionOptions } from '../speech-language-detection/SileroLanguageDetection.js';
import { LanguageDetectionResults } from './LanguageDetectionCommon.js';
export declare function detectSpeechLanguage(input: AudioSourceParam, options: SpeechLanguageDetectionOptions): Promise<SpeechLanguageDetectionResult>;
export interface SpeechLanguageDetectionResult {
    detectedLanguage: string;
    detectedLanguageName: string;
    detectedLanguageProbabilities: LanguageDetectionResults;
    inputRawAudio: RawAudio;
}
export declare function detectSpeechLanguageByParts(sourceRawAudio: RawAudio, getResultsForAudioPart: (audioPart: RawAudio) => Promise<LanguageDetectionResults>, audioPartDuration?: number, hopDuration?: number): Promise<API.LanguageDetectionResults>;
export type SpeechLanguageDetectionEngine = 'silero' | 'whisper' | 'whisper.cpp';
export interface SpeechLanguageDetectionOptions {
    engine?: SpeechLanguageDetectionEngine;
    defaultLanguage?: string;
    fallbackThresholdProbability?: number;
    crop?: boolean;
    silero?: SileroLanguageDetectionOptions;
    whisper?: WhisperLanguageDetectionOptions;
    whisperCpp?: WhisperCppOptions;
    vad?: API.VADOptions;
}
export declare const defaultSpeechLanguageDetectionOptions: SpeechLanguageDetectionOptions;
export declare const speechLanguageDetectionEngines: API.EngineMetadata[];
