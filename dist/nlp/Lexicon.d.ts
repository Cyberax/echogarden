export declare function tryGetFirstLexiconSubstitution(sentenceWords: string[], wordIndex: number, lexicons: Lexicon[], languageCode: string): string[] | undefined;
export declare function tryGetLexiconSubstitution(sentenceWords: string[], wordIndex: number, lexicon: Lexicon, languageCode: string): string[] | undefined;
export declare function loadLexiconFile(jsonFilePath: string): Promise<Lexicon>;
export declare function loadLexiconsForLanguage(language: string, customLexiconPaths?: string[]): Promise<Lexicon[]>;
export type Lexicon = {
    [shortLanguageCode: string]: LexiconForLanguage;
};
export type LexiconForLanguage = {
    [word: string]: LexiconEntry[];
};
export type LexiconEntry = {
    pos?: string[];
    case?: LexiconWordCase;
    pronunciation?: {
        espeak?: LexiconPronunciationForLanguageCodes;
        sapi?: LexiconPronunciationForLanguageCodes;
    };
    precededBy?: string[];
    notPrecededBy?: string[];
    succeededBy?: string[];
    notSucceededBy?: string[];
    example?: string;
};
export type LexiconWordCase = 'any' | 'capitalized' | 'uppercase' | 'lowercase' | 'titlecase' | 'camelcase' | 'pascalcase';
export type LexiconPronunciationForLanguageCodes = {
    [languageCode: string]: string;
};
