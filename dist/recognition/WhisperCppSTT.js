import { spawn } from 'node:child_process';
import { encodeRawAudioToWave, getRawAudioDuration } from '../audio/AudioUtilities.js';
import { Logger } from '../utilities/Logger.js';
import { getRandomHexString } from '../utilities/Utilities.js';
import { tryParseTimeRangePatternWithHours } from '../subtitles/Subtitles.js';
import { getAppTempDir, joinPath } from '../utilities/PathUtilities.js';
import { appName } from '../api/Common.js';
import { readAndParseJsonFile, remove } from '../utilities/FileSystem.js';
import { splitToLines } from '../nlp/Segmentation.js';
import { extendDeep } from '../utilities/ObjectUtilities.js';
import { formatLanguageCodeWithName, getShortLanguageCode } from '../utilities/Locale.js';
import { loadPackage } from '../utilities/PackageManager.js';
import { detectSpeechLanguageByParts } from '../api/SpeechLanguageDetection.js';
export async function recognize(sourceRawAudio, task, sourceLanguage, modelName, modelPath, options) {
    return new Promise(async (resolve, reject) => {
        const logger = new Logger();
        if (sourceRawAudio.sampleRate != 16000) {
            throw new Error('Source audio must have a sample rate of 16000 Hz');
        }
        options = extendDeep(defaultWhisperCppOptions, options);
        let buildKind;
        let executablePath;
        if (options.executablePath) {
            buildKind = 'custom';
            executablePath = options.executablePath;
            if (options.enableGPU == null) {
                options.enableGPU = true;
            }
        }
        else {
            if (options.build) {
                buildKind = options.build;
                if (options.enableGPU == null) {
                    options.enableGPU = buildKind.startsWith('cublas-');
                }
                else if (options.enableGPU === true && !buildKind.startsWith('cublas-')) {
                    throw new Error('GPU support is only available for CUDA builds');
                }
            }
            else {
                if (options.enableGPU) {
                    buildKind = 'cublas-12.4.0';
                }
                else {
                    buildKind = 'cpu';
                }
            }
            executablePath = await loadExecutablePackage(buildKind);
        }
        if (options.enableFlashAttention && options.enableDTW) {
            options.enableDTW = false;
        }
        if (task === 'translate' && options.model.startsWith('large-v3-turbo')) {
            throw new Error(`The 'large-v3-turbo' model doesn't support translation tasks.`);
        }
        logger.start(`Recognize with command-line whisper.cpp (model: ${options.model || modelName}, build: ${buildKind})`);
        logger.log('');
        logger.log('');
        const sourceAsWave = encodeRawAudioToWave(sourceRawAudio);
        const tempDirPath = getAppTempDir(appName);
        const outJsonFilePathWithoutExtension = joinPath(tempDirPath, `${getRandomHexString(16)}`);
        const outJsonFilePath = `${outJsonFilePathWithoutExtension}.json`;
        const args = [
            '--output-json-full',
            '--output-file',
            outJsonFilePathWithoutExtension,
            '--model',
            modelPath,
            '--language',
            sourceLanguage || 'auto',
            '--threads',
            `${options.threadCount}`,
            '--processors',
            `${options.splitCount}`,
            '--best-of',
            `${options.topCandidateCount}`,
            '--beam-size',
            `${options.beamCount}`,
            '--entropy-thold',
            `${options.repetitionThreshold}`,
            '--temperature',
            `${options.temperature}`,
            '--temperature-inc',
            `${options.temperatureIncrement}`,
        ];
        if (options.prompt) {
            args.push('--prompt', options.prompt);
        }
        if (!options.enableGPU) {
            args.push('--no-gpu');
        }
        if (options.enableDTW) {
            args.push('--max-len', '0', '--dtw', modelName.replaceAll('-', '.'));
        }
        else {
            args.push('--max-len', '0');
        }
        if (options.enableFlashAttention) {
            args.push('--flash-attn');
        }
        if (task === 'translate') {
            args.push('--translate');
        }
        else if (task === 'detect-language') {
            args.push('--detect-language');
        }
        const argsString = args.join(' ');
        const process = spawn(executablePath, [...args, '-']);
        const stdoutLines = [];
        let stderrOutput = '';
        process.stdout.setEncoding('utf8');
        process.stdout.on('data', (str) => {
            if (task === 'detect-language') {
                return;
            }
            const parts = splitToLines(str)
                .map(line => line.trim())
                .filter(line => line.length > 0);
            logger.log(parts.join('\n'));
            stdoutLines.push(...parts);
        });
        process.stderr.setEncoding('utf8');
        process.stderr.on('data', (str) => {
            if (options.verbose) {
                logger.log(str);
            }
            stderrOutput += str;
        });
        process.on('error', (e) => {
            reject(e);
        });
        process.on('close', async (exitCode) => {
            logger.end();
            if (exitCode === 0) {
                const parsedStdOut = parseStdOutLinesToTimeline(stdoutLines, 'word');
                const resultObject = await readAndParseJsonFile(outJsonFilePath);
                await remove(outJsonFilePath);
                if (task === 'detect-language') {
                    resolve({ timeline: [], transcript: '', language: resultObject.result.language });
                }
                else {
                    const parsedResultObject = await parseResultObject(resultObject, modelName, getRawAudioDuration(sourceRawAudio), options.enableDTW);
                    resolve(parsedResultObject);
                }
            }
            else {
                reject(`whisper.cpp exited with code ${exitCode}`);
                logger.log(stderrOutput);
            }
        });
        //writeToStdinInChunks(process, sourceAsWave, 2 ** 10)
        process.stdin.end(sourceAsWave);
    });
}
export async function detectLanguage(sourceRawAudio, modelName, modelPath) {
    if (sourceRawAudio.sampleRate != 16000) {
        throw new Error('Source audio must have a sample rate of 16000');
    }
    async function detectLanguageForPart(partAudio) {
        const { language } = await recognize(partAudio, 'detect-language', undefined, modelName, modelPath, {});
        const partResults = [{
                language: language,
                languageName: formatLanguageCodeWithName(language),
                probability: 1.0,
            }];
        return partResults;
    }
    const results = await detectSpeechLanguageByParts(sourceRawAudio, detectLanguageForPart);
    results.sort((entry1, entry2) => entry2.probability - entry1.probability);
    return results;
}
async function parseResultObject(resultObject, modelName, totalDuration, enableDTW) {
    const { Whisper } = await import('../recognition/WhisperSTT.js');
    const whisper = new Whisper(modelName, '', [], []);
    await whisper.initializeTokenizerIfNeeded();
    const tokenTimeline = [];
    let currentCorrectionTimeOffset = 0;
    let lastTokenEndOffset = 0;
    for (let segmentIndex = 0; segmentIndex < resultObject.transcription.length; segmentIndex++) {
        const segmentObject = resultObject.transcription[segmentIndex];
        const tokens = segmentObject.tokens;
        for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
            const tokenObject = tokens[tokenIndex];
            // Workaround whisper.cpp issue with missing offsets by falling back to last known end offset
            // when they are not included
            if (!tokenObject.offsets) {
                tokenObject.offsets = {
                    from: lastTokenEndOffset,
                    to: lastTokenEndOffset,
                };
            }
            else {
                lastTokenEndOffset = tokenObject.offsets.to;
            }
            if (tokenIndex === 0 && tokenObject.text === '[_BEG_]' && tokenObject.offsets.from === 0) {
                currentCorrectionTimeOffset = segmentObject.offsets.from / 1000;
            }
            const tokenId = tokenObject.id;
            const tokenText = whisper.tokenToText(tokenId, true);
            const tokenConfidence = tokenObject.p;
            let startTime;
            let endTime;
            if (enableDTW) {
                const nextTokenEntry = tokens[tokenIndex + 1];
                const tokenEntryDtwStartTime = tokenObject.t_dtw / 100;
                const nextTokenEntryDtwStartTime = nextTokenEntry ? nextTokenEntry.t_dtw / 100 : totalDuration;
                startTime = Math.max(tokenEntryDtwStartTime, 0);
                endTime = nextTokenEntryDtwStartTime;
            }
            else {
                startTime = tokenObject.offsets.from / 1000;
                endTime = tokenObject.offsets.to / 1000;
            }
            startTime += currentCorrectionTimeOffset;
            endTime += currentCorrectionTimeOffset;
            tokenTimeline.push({
                type: 'token',
                text: tokenText,
                id: tokenId,
                startTime,
                endTime,
                confidence: tokenConfidence
            });
        }
    }
    const allTokenIds = tokenTimeline.map(entry => entry.id);
    const transcript = whisper.tokensToText(allTokenIds).trim();
    const language = resultObject.result.language;
    const timeline = whisper.tokenTimelineToWordTimeline(tokenTimeline, language);
    return {
        transcript,
        timeline,
        language
    };
}
function parseStdOutLinesToTimeline(lines, entryType) {
    let transcript = '';
    const timeline = [];
    for (const line of lines) {
        const openingSquareBracketIndex = line.indexOf('[');
        const closingSquareBracketIndex = line.indexOf(']', openingSquareBracketIndex + 1);
        const timeRangeString = line.substring(openingSquareBracketIndex + 1, closingSquareBracketIndex);
        const { startTime, endTime, succeeded } = tryParseTimeRangePatternWithHours(timeRangeString);
        if (!succeeded) {
            continue;
        }
        const text = line.substring(closingSquareBracketIndex + 1 + 2);
        if (text.length === 0) {
            continue;
        }
        transcript += text;
        if (timeline.length === 0 || text.startsWith(' ')) {
            timeline.push({
                type: entryType,
                text: text.trim(),
                startTime: startTime,
                endTime: endTime,
            });
        }
        else {
            const previousEntry = timeline[timeline.length - 1];
            previousEntry.text += text;
            previousEntry.endTime = endTime;
        }
    }
    return { transcript, timeline };
}
export async function loadModelPackage(modelId, languageCode) {
    if (modelId === 'large') {
        modelId = 'large-v2';
    }
    if (modelId) {
        const modelName = getModelNameFromModelId(modelId);
        if (languageCode != 'en' && modelName.endsWith('.en')) {
            throw new Error(`The English-only model '${modelName}' cannot be used with a non-English language '${languageCode}'.`);
        }
    }
    else {
        if (languageCode) {
            const shortLanguageCode = getShortLanguageCode(languageCode);
            modelId = shortLanguageCode == 'en' ? 'base.en' : 'base';
        }
        else {
            modelId = 'base';
        }
    }
    const packageName = `whisper.cpp-${modelId}`;
    const modelDir = await loadPackage(packageName);
    const modelPath = joinPath(modelDir, `ggml-${modelId}.bin`);
    const modelName = getModelNameFromModelId(modelId);
    return { modelName, modelPath };
}
export async function loadExecutablePackage(buildKind) {
    if (buildKind === 'custom') {
        throw new Error(`A 'custom' build kind requires providing a custom path to the whisper.cpp binary in the 'executablePath' option.`);
    }
    const platform = process.platform;
    const arch = process.arch;
    let packageName;
    if (buildKind.startsWith('cublas-')) {
        if (platform === 'win32' && arch === 'x64') {
            packageName = `whisper.cpp-binaries-windows-x64-${buildKind}-latest`;
        }
        else {
            throw new Error(`whisper.cpp GPU builds (NVIDIA CUDA only) are currently only available as packages for Windows x64. Please specify a custom path to a whisper.cpp 'main' binary in the 'executablePath' option.`);
        }
    }
    else if (buildKind === 'cpu') {
        if (platform === 'win32' && arch === 'x64') {
            packageName = `whisper.cpp-binaries-windows-x64-cpu-latest`;
        }
        else if (platform === 'linux' && arch === 'x64') {
            packageName = `whisper.cpp-binaries-linux-x64-cpu-latest`;
        }
        else {
            throw new Error(`Couldn't find a matching whisper.cpp binary package. Please specify a custom path to a whisper.cpp 'main' binary in the 'executablePath' option.`);
        }
    }
    else {
        throw new Error(`Unsupported build kind '${buildKind}'`);
    }
    const packagePath = await loadPackage(packageName);
    let filename = 'main';
    if (platform === 'win32') {
        filename += '.exe';
    }
    return joinPath(packagePath, filename);
}
function getModelNameFromModelId(modelId) {
    if (modelId.startsWith('large-v1')) {
        return 'large-v1';
    }
    if (modelId.startsWith('large-v2')) {
        return 'large-v2';
    }
    if (modelId.startsWith('large-v3-turbo')) {
        return 'large-v3-turbo';
    }
    if (modelId.startsWith('large-v3')) {
        return 'large-v3';
    }
    const lastDashIndex = modelId.lastIndexOf('-');
    let modelName;
    if (lastDashIndex >= 0) {
        modelName = modelId.substring(0, lastDashIndex);
    }
    else {
        modelName = modelId;
    }
    return modelName;
}
export const defaultWhisperCppOptions = {
    build: undefined,
    executablePath: undefined,
    model: undefined,
    threadCount: 4,
    splitCount: 1,
    enableGPU: undefined,
    topCandidateCount: 5,
    beamCount: 5,
    repetitionThreshold: 2.4,
    temperature: 0,
    temperatureIncrement: 0.2,
    prompt: undefined,
    enableDTW: false,
    enableFlashAttention: false,
    verbose: false,
};
//# sourceMappingURL=WhisperCppSTT.js.map