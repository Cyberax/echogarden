import { IncomingMessage } from 'node:http';
import { RandomGenerator } from './RandomGenerator.js';
import { Logger } from './Logger.js';
import { ChildProcessWithoutNullStreams } from 'node:child_process';
export declare function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array<ArrayBufferLike>;
export declare function concatFloat32Arrays(arrays: Float32Array[]): Float32Array<ArrayBufferLike>;
export declare function shuffleArray<T>(array: T[], randomGen: RandomGenerator): T[];
export declare function shuffleArrayInPlace<T>(array: T[], randomGen: RandomGenerator): T[];
export declare function writeToStderr(message: any): void;
export declare function printToStderr(message: any): void;
export declare function logToStderr(message: any): void;
export declare function formatObjectToString(obj: any): string;
export declare function getRandomHexString(charCount?: number): string;
export declare function getRandomUUID(dashes?: boolean): string;
export declare function sumArray<T>(arr: Array<T>, valueGetter: (item: T) => number): number;
export declare function roundToDigits(val: number, digits?: number): number;
export declare function delay(timeMs: number): Promise<unknown>;
export declare function yieldToEventLoop(): Promise<unknown>;
export declare function printMatrix(matrix: Float32Array[]): void;
export declare function parseJson(jsonText: string, useJson5?: boolean): Promise<any>;
export declare function stringifyAndFormatJson(obj: any, useJson5?: boolean): Promise<string>;
export declare function parseJSONAndGetType(str: string, useJson5?: boolean): Promise<{
    parsedValue: any;
    jsonType: "string" | "number" | "boolean" | "object" | "null" | "array" | undefined;
}>;
export declare function secondsToHMS(totalSeconds: number): {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};
export declare function secondsToMS(totalSeconds: number): {
    minutes: number;
    seconds: number;
    milliseconds: number;
};
export declare function intsInRange(start: number, end: number): number[];
export declare function serializeMapToObject<V>(map: Map<string, V>): {
    [key: string]: V;
};
export declare function deserializeObjectToMap<V>(obj: {
    [key: string]: V;
}): Map<string, V>;
export declare function waitTimeout(timeout?: number): Promise<void>;
export declare function waitImmediate(): Promise<void>;
export declare function waitNextTick(): Promise<void>;
export declare function setupUnhandledExceptionListeners(): void;
export declare function setupProgramTerminationListeners(cleanupFunc?: () => void): void;
export declare function clip(num: number, min: number, max: number): number;
export declare function readBinaryIncomingMessage(incomingMessage: IncomingMessage): Promise<Uint8Array<ArrayBufferLike>>;
export declare function splitFloat32Array(nums: Float32Array, partSize: number): Float32Array[];
export declare function sha256AsHex(input: string): Promise<string>;
export declare function commandExists(command: string): Promise<boolean>;
export declare function resolveModuleMainPath(moduleName: string): Promise<string>;
export declare function getWithDefault<T>(value: T | undefined, defaultValue: T): T;
export declare function splitFilenameOnExtendedExtension(filenameWithExtension: string): string[];
export declare function resolveModuleScriptPath(moduleName: string): Promise<string>;
export declare function runOperationWithRetries<R>(operationFunc: () => Promise<R>, logger: Logger, operationName?: string, delayBetweenRetries?: number, maxRetries?: number): Promise<R>;
export declare function writeToStdinInChunks(process: ChildProcessWithoutNullStreams, buffer: Uint8Array, chunkSize: number): void;
export declare function getIntegerRange(start: number, end: number): number[];
export declare function isUint8Array(value: any): value is Uint8Array;
export declare function isWasmSimdSupported(): Promise<boolean>;
