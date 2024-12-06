import chalk from 'chalk';
import { Timer } from './Timer.js';
import { logToStderr, writeToStderr, yieldToEventLoop } from './Utilities.js';
import { logLevelGreaterOrEqualTo, logLevelSmallerThan } from '../api/GlobalOptions.js';
let currentActiveLogger = null;
export class Logger {
    timer = new Timer();
    active = false;
    start(title, titleColor = chalk.cyanBright) {
        this.startAsync(title, false, titleColor);
    }
    async startAsync(title, yieldBeforeStart = true, titleColor = chalk.cyanBright) {
        if (currentActiveLogger != null && currentActiveLogger != this) {
            return;
        }
        this.end();
        if (yieldBeforeStart) {
            await yieldToEventLoop();
        }
        if (logLevelGreaterOrEqualTo('info')) {
            writeToStderr(`${titleColor(title)}.. `);
        }
        this.setAsActiveLogger();
        this.timer.restart();
    }
    setAsActiveLogger() {
        this.active = true;
        currentActiveLogger = this;
    }
    unsetAsActiveLogger() {
        this.active = false;
        currentActiveLogger = null;
    }
    end() {
        if (this.active && currentActiveLogger == this) {
            const elapsedTime = this.timer.elapsedTime;
            if (logLevelGreaterOrEqualTo('info')) {
                writeToStderr(`${elapsedTime.toFixed(1)}ms\n`);
            }
            currentActiveLogger = null;
        }
        this.active = false;
    }
    logDuration(message, startTime, titleColor = chalk.cyanBright, logLevel = 'info') {
        const duration = Timer.currentTime - startTime;
        this.log(`${titleColor(message)}: ${duration.toFixed(1)}ms`, logLevel);
    }
    logTitledMessage(title, content, titleColor = chalk.cyanBright, logLevel = 'info') {
        this.log(`${titleColor(title)}: ${content}`, logLevel);
    }
    log(message, logLevel = 'info') {
        if (logLevelSmallerThan(logLevel)) {
            return;
        }
        if (currentActiveLogger == this || currentActiveLogger == null) {
            logToStderr(message);
        }
    }
    write(message, logLevel = 'info') {
        if (logLevelSmallerThan(logLevel)) {
            return;
        }
        if (currentActiveLogger == this || currentActiveLogger == null) {
            writeToStderr(message);
        }
    }
    getTimestamp() {
        return Timer.currentTime;
    }
}
export function resetActiveLogger() {
    currentActiveLogger = null;
}
//# sourceMappingURL=Logger.js.map