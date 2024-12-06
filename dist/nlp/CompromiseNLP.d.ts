import { Lexicon } from './Lexicon.js';
export declare function parse(text: string): Promise<CompromiseParsedDocument>;
export declare function tryMatchInLexicons(term: CompromiseParsedTerm, lexicons: Lexicon[], espeakVoice: string): string[] | undefined;
export declare function tryMatchInLexicon(term: CompromiseParsedTerm, lexicon: Lexicon, espeakVoice: string): string[] | undefined;
export type CompromiseParsedDocument = CompromiseParsedSentence[];
export type CompromiseParsedSentence = CompromiseParsedTerm[];
export type CompromiseParsedTerm = {
    text: string;
    pos: string;
    tags: string[];
    preText: string;
    postText: string;
    startOffset: number;
    endOffset: number;
};
