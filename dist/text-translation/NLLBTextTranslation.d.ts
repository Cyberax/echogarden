import { TranslationPair } from '../api/TextTranslation.js';
export declare function translateText(sourceText: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationPair[]>;
