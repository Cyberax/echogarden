export declare function getNormalizedFragmentsForSpeech(words: string[], language: string): {
    normalizedFragments: string[];
    referenceFragments: string[];
};
export declare function normalizeFourDigitYearString(yearString: string): string;
export declare function normalizeFourDigitDecadeString(decadeString: string): string;
export declare function simplifyPunctuationCharacters(text: string): string;
export declare const punctuationSubstitutionLookup: Record<string, string>;
