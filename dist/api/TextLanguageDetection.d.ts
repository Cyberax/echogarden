import * as API from './API.js';
import { LanguageDetectionResults } from './LanguageDetectionCommon.js';
export declare function detectTextLanguage(input: string, options: TextLanguageDetectionOptions): Promise<TextLanguageDetectionResult>;
export interface TextLanguageDetectionResult {
    detectedLanguage: string;
    detectedLanguageName: string;
    detectedLanguageProbabilities: LanguageDetectionResults;
}
export type LanguageDetectionGroupResults = LanguageDetectionGroupResultsEntry[];
export interface LanguageDetectionGroupResultsEntry {
    languageGroup: string;
    probability: number;
}
export type TextLanguageDetectionEngine = 'tinyld' | 'fasttext';
export interface TextLanguageDetectionOptions {
    engine?: TextLanguageDetectionEngine;
    defaultLanguage?: string;
    fallbackThresholdProbability?: number;
}
export declare const defaultTextLanguageDetectionOptions: TextLanguageDetectionOptions;
export declare const textLanguageDetectionEngines: API.EngineMetadata[];
