import { LogLevel } from '../api/GlobalOptions.js';
export declare class Logger {
    private timer;
    active: boolean;
    start(title: string, titleColor?: import("chalk").ChalkInstance): void;
    startAsync(title: string, yieldBeforeStart?: boolean, titleColor?: import("chalk").ChalkInstance): Promise<void>;
    setAsActiveLogger(): void;
    unsetAsActiveLogger(): void;
    end(): void;
    logDuration(message: any, startTime: number, titleColor?: import("chalk").ChalkInstance, logLevel?: LogLevel): void;
    logTitledMessage(title: string, content: any, titleColor?: import("chalk").ChalkInstance, logLevel?: LogLevel): void;
    log(message: any, logLevel?: LogLevel): void;
    write(message: any, logLevel?: LogLevel): void;
    getTimestamp(): number;
}
export declare function resetActiveLogger(): void;
