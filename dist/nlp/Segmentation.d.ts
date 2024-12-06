import { ParagraphBreakType, WhitespaceProcessing } from '../api/Common.js';
export declare const wordCharacterPattern: RegExp;
export declare const punctuationPattern: RegExp;
export declare const phraseSeparators: string[];
export declare const symbolWords: string[];
export declare function isWordOrSymbolWord(str: string): boolean;
export declare function isSymbolWord(str: string): boolean;
export declare function isWord(str: string): boolean;
export declare function isPunctuation(str: string): boolean;
export declare function isWhitespace(str: string): boolean;
export declare class Sentence {
    phrases: Phrase[];
    readonly isSentenceFinalizer = true;
    get length(): number;
    get text(): string;
}
export declare class Phrase {
    words: Word[];
    get length(): number;
    get text(): string;
    get lastWord(): Word | undefined;
    get isSentenceFinalizer(): boolean;
}
export declare class Word {
    readonly text: string;
    isSentenceFinalizer: boolean;
    constructor(text: string, isSentenceFinalizer: boolean);
    get containsOnlyPunctuation(): boolean;
    get isSymbolWord(): boolean;
    get isPhraseSeperator(): boolean;
    get length(): number;
}
export type Segment = Sentence | Phrase | Word;
export declare class Fragment {
    segments: Segment[];
    get length(): number;
    get text(): string;
    get isEmpty(): boolean;
    get isNonempty(): boolean;
    get lastSegment(): Segment | undefined;
}
export declare function splitToFragments(text: string, maxFragmentLength: number, langCode: string, preserveSentences?: boolean, preservePhrases?: boolean): Promise<Fragment[]>;
export declare function parse(text: string, langCode: string): Promise<Sentence[]>;
export declare function splitToSentences(text: string, langCode: string): string[];
export declare function splitToWords(text: string, langCode: string): Promise<string[]>;
export declare function splitToParagraphs(text: string, paragraphBreaks: ParagraphBreakType, whitespaceProcessingMethod: WhitespaceProcessing): string[];
export declare function applyWhitespaceProcessing(text: string, whitespaceProcessingMethod: WhitespaceProcessing): string;
export declare function splitToLines(text: string): string[];
