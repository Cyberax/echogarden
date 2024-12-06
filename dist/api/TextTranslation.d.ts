import * as API from './API.js';
import { type GoogleTranslateTextTranslationOptions } from '../text-translation/GoogleTranslateTextTranslation.js';
export declare function translateText(inputText: string, options: TextTranslationOptions): Promise<TextTranslationResult>;
export interface TextTranslationOptions {
    engine?: TextTranslationEngine;
    sourceLanguage?: string;
    targetLanguage?: string;
    languageDetection?: API.TextLanguageDetectionOptions;
    plainText?: API.PlainTextOptions;
    nllb?: {};
    googleTranslate?: GoogleTranslateTextTranslationOptions;
    deepl?: {};
}
export interface TextTranslationResult {
    text: string;
    translatedText: string;
    translationPairs: TranslationPair[];
    sourceLanguage: string;
    targetLanguage: string;
}
export type TextTranslationEngine = 'nllb' | 'google-translate' | 'deepl';
export interface TranslationPair {
    sourceText: string;
    translatedText: string;
}
export declare const defaultTextTranslationOptions: TextTranslationOptions;
export declare const textTranslationEngines: API.EngineMetadata[];
