export declare function includesAnyOf(str: string, substrings: string[]): boolean;
export declare function indexOfAnyOf(str: string, substrings: string[]): number;
export declare function startsWithAnyOf(str: string, prefixes: string[]): boolean;
export declare function formatHMS(timeHMS: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}, decimalSeparator?: string): string;
export declare function formatMS(timeMS: {
    minutes: number;
    seconds: number;
    milliseconds: number;
}, decimalSeparator?: string): string;
export declare function formatIntegerWithLeadingZeros(num: number, minDigitCount: number): string;
export declare function formatListWithQuotedElements(strings: string[], quoteSymbol?: string): string;
export declare function getUTF32Chars(str: string): {
    utf32chars: string[];
    mapping: number[];
};
export declare function containsInvalidCodepoint(str: string): boolean;
export declare function splitAndPreserveSeparators(text: string, separatorRegex: RegExp): string[];
export declare function getTokenRepetitionScore(tokens: string[] | number[]): {
    longestMatch: number;
    longestCycleRepetition: number;
};
export declare function convertHtmlToText(html: string): Promise<any>;
export declare function substituteCharactersUsingLookup(text: string, substitutionLookup: Record<string, string>): string;
