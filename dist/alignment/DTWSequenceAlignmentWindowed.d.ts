import { AlignmentPath } from './SpeechAlignment.js';
export declare function alignDTWWindowed<T, U>(sequence1: ArrayLike<T>, sequence2: ArrayLike<U>, costFunction: (a: T, b: U) => number, windowMaxLength: number, centerIndexes?: ArrayLike<number>): {
    path: AlignmentPath;
    pathCost: number;
};
