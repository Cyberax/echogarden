import { AlignmentPath } from './SpeechAlignment.js';
export declare function alignLevenshtein<T, U>(sequence1: T[], sequence2: U[], getSubstitutionCost: (a: T, b: U) => number): {
    path: AlignmentPath;
    pathCost: number;
};
