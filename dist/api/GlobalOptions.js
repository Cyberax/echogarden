export function getGlobalOption(key) {
    if (!listGlobalOptions().includes(key)) {
        throw new Error(`Unknown global option key '${key}'`);
    }
    return globalOptions[key];
}
export function setGlobalOption(key, value) {
    if (!listGlobalOptions().includes(key)) {
        throw new Error(`Unknown global option key '${key}'`);
    }
    globalOptions[key] = value;
}
export function listGlobalOptions() {
    return Object.keys(globalOptions);
}
export function logLevelToNumber(logLevel) {
    return logLevels.indexOf(logLevel);
}
export function getLogLevel() {
    return globalOptions.logLevel ?? 'info';
}
export function logLevelGreaterOrEqualTo(referenceLevel) {
    return !logLevelSmallerThan(referenceLevel);
}
export function logLevelSmallerThan(referenceLevel) {
    return logLevelToNumber(getLogLevel()) < logLevelToNumber(referenceLevel);
}
const logLevels = ['silent', 'output', 'error', 'warning', 'info', 'trace'];
const globalOptions = {
    ffmpegPath: undefined,
    soxPath: undefined,
    packageBaseURL: 'https://huggingface.co/echogarden/echogarden-packages/resolve/main/',
    logLevel: 'info',
};
//# sourceMappingURL=GlobalOptions.js.map