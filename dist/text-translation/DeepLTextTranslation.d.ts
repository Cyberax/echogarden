import { TranslationPair } from "../api/TextTranslation.js";
export declare function translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationPair[]>;
