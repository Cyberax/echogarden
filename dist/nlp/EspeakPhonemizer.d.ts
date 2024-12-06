export declare function phonemizeSentence(sentence: string, espeakVoice: string, substitutionMap?: Map<string, string[]>, useIpa?: boolean): Promise<string[][][]>;
export declare function phonemizeText(text: string, voice: string, substitutionMap?: Map<string, string[]>): Promise<string[][][]>;
export declare function phonemizeClauses(clauses: string[], voice: string, clauseBreakers: string[], substitutionMap?: Map<string, string[]>): Promise<string[][][]>;
export declare function phonemizedClausesToSentences(phonemizedClauses: string[][][]): string[][][];
