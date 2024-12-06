export declare abstract class RandomGenerator {
    getIntInRange(min: number, max: number): number;
    getFloatInRange(min?: number, max?: number): number;
    getFloats(length: number, min?: number, max?: number): number[];
    getInts(length: number, min: number, max: number): number[];
    getNormallyDistributedVector(elementCount: number, meanVector: ArrayLike<number>, standardDeviationVector: ArrayLike<number>): number[];
    getNormallyDistributedValues(count: number, mean?: number, standardDeviation?: number): number[];
    getNormallyDistributedPair(): number[];
    selectRandomIndexFromDistribution(distribution: ArrayLike<number>): number;
    abstract nextFloat(): number;
    abstract nextUint32(): number;
    abstract nextInt32(): number;
}
export declare abstract class Int32RandomGenerator extends RandomGenerator {
    nextUint32(): number;
    nextFloat(): number;
}
export declare class XorShift32PRNG extends Int32RandomGenerator {
    state: number;
    constructor(seed: number);
    nextInt32(): number;
}
