export declare function getGlobalOption<K extends keyof GlobalOptions>(key: K): GlobalOptions[K];
export declare function setGlobalOption<K extends keyof GlobalOptions>(key: K, value: GlobalOptions[K]): void;
export declare function listGlobalOptions(): string[];
export declare function logLevelToNumber(logLevel: LogLevel): number;
export declare function getLogLevel(): "silent" | "output" | "error" | "warning" | "info" | "trace";
export declare function logLevelGreaterOrEqualTo(referenceLevel: LogLevel): boolean;
export declare function logLevelSmallerThan(referenceLevel: LogLevel): boolean;
declare const logLevels: readonly ["silent", "output", "error", "warning", "info", "trace"];
export type LogLevel = typeof logLevels[number];
export interface GlobalOptions {
    ffmpegPath?: string;
    soxPath?: string;
    packageBaseURL?: string;
    logLevel?: LogLevel;
}
export {};
