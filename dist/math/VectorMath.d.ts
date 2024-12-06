export declare function covarianceMatrixOfSamples(samples: ArrayLike<number>[], weights?: ArrayLike<number>, biased?: boolean): {
    covarianceMatrix: Float32Array<ArrayBufferLike>[];
    mean: Float32Array<ArrayBuffer>;
};
export declare function covarianceMatrixOfCenteredSamples(centeredSamples: ArrayLike<number>[], biased?: boolean, diagonalRegularizationAmount?: number): Float32Array<ArrayBufferLike>[];
export declare function weightedCovarianceMatrixOfCenteredSamples(centeredSamples: ArrayLike<number>[], weights: ArrayLike<number>, diagonalRegularizationAmount?: number): Float32Array<ArrayBufferLike>[];
export declare function centerVectors(vectors: ArrayLike<number>[], weights?: ArrayLike<number>): {
    centeredVectors: Float32Array[];
    mean: Float32Array<ArrayBuffer>;
};
export declare function centerVector(vector: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function scaleToSumTo1(vector: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function normalizeVector(vector: ArrayLike<number>, kind?: 'population' | 'sample'): {
    normalizedVector: Float32Array<ArrayBuffer>;
    mean: number;
    stdDeviation: number;
};
export declare function normalizeVectors(vectors: ArrayLike<number>[], kind?: 'population' | 'sample'): {
    normalizedVectors: Float32Array[];
    mean: Float32Array<ArrayBuffer>;
    stdDeviation: Float32Array<ArrayBuffer>;
};
export declare function deNormalizeVectors(normalizedVectors: ArrayLike<number>[], originalMean: ArrayLike<number>, originalStdDeviation: ArrayLike<number>): Float32Array<ArrayBufferLike>[];
export declare function meanOfVectors(vectors: ArrayLike<number>[]): Float32Array<ArrayBuffer>;
export declare function weightedMeanOfVectors(vectors: ArrayLike<number>[], weights: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function stdDeviationOfVectors(vectors: ArrayLike<number>[], kind?: 'population' | 'sample', mean?: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function varianceOfVectors(vectors: ArrayLike<number>[], kind?: 'population' | 'sample', mean?: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function meanOfVector(vector: ArrayLike<number>): number;
export declare function medianOfVector(vector: ArrayLike<number>): number;
export declare function stdDeviationOfVector(vector: ArrayLike<number>, kind?: 'population' | 'sample', mean?: number): number;
export declare function varianceOfVector(vector: ArrayLike<number>, kind?: 'population' | 'sample', mean?: number): number;
export declare function logOfVector(vector: ArrayLike<number>, minVal?: number): Float32Array<ArrayBuffer>;
export declare function expOfVector(vector: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function transpose(matrix: ArrayLike<number>[]): Float32Array<ArrayBufferLike>[];
export declare function movingAverageOfWindow3(vector: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function averageMeanSquaredError(actual: ArrayLike<number>[], expected: ArrayLike<number>[]): number;
export declare function meanSquaredError(actual: ArrayLike<number>, expected: ArrayLike<number>): number;
export declare function euclideanDistance(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function squaredEuclideanDistance(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function euclideanDistance13Dim(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function squaredEuclideanDistance13Dim(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function cosineDistance(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function cosineSimilarity(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function cosineDistancePrecomputedMagnitudes(vector1: ArrayLike<number>, vector2: ArrayLike<number>, magnitude1: number, magnitude2: number): number;
export declare function cosineSimilarityPrecomputedMagnitudes(vector1: ArrayLike<number>, vector2: ArrayLike<number>, magnitude1: number, magnitude2: number): number;
export declare function minkowskiDistance(vector1: ArrayLike<number>, vector2: ArrayLike<number>, power: number): number;
export declare function subtractVectors(vector1: ArrayLike<number>, vector2: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function sumVector(vector: ArrayLike<number>): number;
export declare function sumOfSquaresForVector(vector: ArrayLike<number>): number;
export declare function dotProduct(vector1: ArrayLike<number>, vector2: ArrayLike<number>): number;
export declare function magnitude(vector: ArrayLike<number>): number;
export declare function maxValue(vector: ArrayLike<number>): number;
export declare function indexOfMax(vector: ArrayLike<number>): number;
export declare function minValue(vector: ArrayLike<number>): number;
export declare function indexOfMin(vector: ArrayLike<number>): number;
export declare function sigmoid(x: number): number;
export declare function softmax(logits: ArrayLike<number>, temperature?: number): Float32Array<ArrayBuffer>;
export declare function hammingDistance(value1: number, value2: number, bitLength?: number): number;
export declare function createVectorArray(vectorCount: number, featureCount: number, initialValue?: number): Float32Array<ArrayBufferLike>[];
export declare function createVector(elementCount: number, initialValue?: number): Float32Array<ArrayBuffer>;
export declare function zeroIfNaN(val: number): number;
export declare function logSumExp(values: ArrayLike<number>, minVal?: number): number;
export declare function sumExp(values: ArrayLike<number>): number;
export declare function logSoftmax(values: ArrayLike<number>, minVal?: number): Float32Array<ArrayBuffer>;
export declare class IncrementalMean {
    currentElementCount: number;
    currentMean: number;
    addValueToMean(value: number): void;
}
export type DistanceFunction = (a: ArrayLike<number>, b: ArrayLike<number>) => number;
export interface ComplexNumber {
    real: number;
    imaginary: number;
}
