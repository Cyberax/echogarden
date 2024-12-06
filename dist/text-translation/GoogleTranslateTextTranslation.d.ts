import { TranslationPair } from "../api/TextTranslation.js";
import { PlainTextOptions } from "../api/Common.js";
export declare function translateText(text: string, sourceLanguage: string, targetLanguage: string, plainTextOptions: PlainTextOptions, options: GoogleTranslateTextTranslationOptions): Promise<{
    translationPairs: TranslationPair[];
    translatedText: string;
}>;
export declare function translateText_MobileWeb(text: string, sourceLanguage: string, targetLanguage: string, options: GoogleTranslateTextTranslationOptions): Promise<{
    sourceText: string;
    translatedText: string;
}[]>;
export declare function supportsLanguage(langCode: string): boolean;
export declare const supportedLanguageCodes: string[];
export interface GoogleTranslateTextTranslationOptions {
    tld?: string;
    maxCharactersPerPart?: number;
}
export declare const defaultGoogleTranslateTextTranslationOptions: GoogleTranslateTextTranslationOptions;
