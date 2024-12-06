import { type PreTrainedModel, type PreTrainedTokenizer } from '@echogarden/transformers-nodejs-lite';
import { Timeline } from '../utilities/Timeline.js';
export declare function alignTimelineToTextSemantically(timeline: Timeline, text: string, textLangCode: string): Promise<Timeline>;
export declare function alignWordsToWordsSemantically(wordsGroups1: string[][], wordsGroups2: string[][], windowTokenCount?: number): Promise<WordMapping[]>;
export declare class E5TextEmbedding {
    readonly modelPath: string;
    tokenizer?: PreTrainedTokenizer;
    model?: PreTrainedModel;
    constructor(modelPath: string);
    tokenizeToModelInputs(text: string): Promise<any>;
    inferTokenEmbeddings(inputs: any): Promise<TokenEmbeddingData[]>;
    initializeIfNeeded(): Promise<void>;
}
export interface TokenEmbeddingData {
    id: number;
    text: string;
    embeddingVector: Float32Array;
}
export interface WordMapping {
    wordIndex1: number;
    word1: string;
    wordIndex2: number;
    word2: string;
}
export declare const e5SupportedLanguages: string[];
