export declare class Timer {
    startTime: number;
    constructor();
    restart(): void;
    get elapsedTime(): number;
    get elapsedTimeSeconds(): number;
    getElapsedTimeAndRestart(): number;
    logAndRestart(title: string, timePrecision?: number): number;
    static get currentTime(): number;
    static get microsecondTimestamp(): number;
    private static createGlobalTimestampFunction;
    private static timestampFunc;
}
