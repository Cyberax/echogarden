import { AlignmentPath } from './SpeechAlignment.js';
export declare function alignDTW<T, U>(sequence1: ArrayLike<T>, sequence2: ArrayLike<U>, costFunction: (a: T, b: U) => number): {
    path: AlignmentPath;
    pathCost: number;
};
