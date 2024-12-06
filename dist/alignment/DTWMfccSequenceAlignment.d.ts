export declare function alignMFCC_DTW(mfccFrames1: ArrayLike<number>[], mfccFrames2: ArrayLike<number>[], windowLength: number, distanceFunctionKind?: 'euclidean' | 'cosine', centerIndexes?: number[]): Promise<import("./SpeechAlignment.js").AlignmentPath>;
export declare function getCostMatrixMemorySizeMB(sequence1Length: number, sequence2Length: number, windowLength: number): number;
