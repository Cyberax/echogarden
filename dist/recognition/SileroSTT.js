import { indexOfMax } from '../math/VectorMath.js';
import { wordCharacterPattern } from '../nlp/Segmentation.js';
import { Logger } from '../utilities/Logger.js';
import { logToStderr } from '../utilities/Utilities.js';
import { getRawAudioDuration } from '../audio/AudioUtilities.js';
import { readAndParseJsonFile } from '../utilities/FileSystem.js';
import { getOnnxSessionOptions } from '../utilities/OnnxUtilities.js';
import { joinPath } from '../utilities/PathUtilities.js';
const log = logToStderr;
export async function recognize(rawAudio, modelDirectoryPath, executionProviders) {
    const silero = new SileroSTT(modelDirectoryPath, executionProviders);
    const result = await silero.recognize(rawAudio);
    return result;
}
export class SileroSTT {
    modelDirectoryPath;
    executionProviders;
    session;
    labels;
    constructor(modelDirectoryPath, executionProviders) {
        this.modelDirectoryPath = modelDirectoryPath;
        this.executionProviders = executionProviders;
    }
    async recognize(rawAudio) {
        const logger = new Logger();
        await this.initializeIfNeeded();
        logger.start('Recognize with silero model');
        const audioSamples = rawAudio.audioChannels[0];
        const Onnx = await import('onnxruntime-node');
        const inputTensor = new Onnx.Tensor('float32', audioSamples, [1, audioSamples.length]);
        const inputs = { input: inputTensor };
        const results = await this.session.run(inputs);
        const rawResultValues = results['output'].data;
        const labels = this.labels;
        const tokenResults = [];
        for (let i = 0; i < rawResultValues.length; i += labels.length) {
            tokenResults.push(rawResultValues.subarray(i, i + labels.length));
        }
        const tokens = [];
        for (const tokenResult of tokenResults) {
            const bestCandidateIndex = indexOfMax(new Array(...tokenResult));
            tokens.push(labels[bestCandidateIndex]);
        }
        //log(tokens.join('|'))
        const result = this.tokensToTimeline(tokens, getRawAudioDuration(rawAudio));
        logger.end();
        return result;
    }
    async initializeIfNeeded() {
        if (this.session) {
            return;
        }
        const logger = new Logger();
        logger.start('Create ONNX inference session');
        const Onnx = await import('onnxruntime-node');
        const modelPath = joinPath(this.modelDirectoryPath, 'model.onnx');
        const labelsPath = joinPath(this.modelDirectoryPath, 'labels.json');
        this.labels = await readAndParseJsonFile(labelsPath);
        const onnxSessionOptions = getOnnxSessionOptions({ executionProviders: this.executionProviders });
        this.session = await Onnx.InferenceSession.create(modelPath, onnxSessionOptions);
        logger.end();
    }
    tokensToTimeline(tokens, totalDuration) {
        const tokenCount = tokens.length;
        const decodedTokens = [];
        let tokenGroupIndexes = [[]];
        for (let i = 0; i < tokenCount; i++) {
            const token = tokens[i];
            if (token == '2') {
                if (decodedTokens.length > 0) {
                    const previousDecodedToken = decodedTokens[decodedTokens.length - 1];
                    decodedTokens.push('$');
                    decodedTokens.push(previousDecodedToken);
                    tokenGroupIndexes[tokenGroupIndexes.length - 1].push(i);
                }
                else {
                    decodedTokens.push(' ');
                    tokenGroupIndexes.push([]);
                }
                continue;
            }
            if (token == '_') {
                continue;
            }
            decodedTokens.push(token);
            if (token == ' ') {
                tokenGroupIndexes.push([]);
            }
            else {
                tokenGroupIndexes[tokenGroupIndexes.length - 1].push(i);
            }
        }
        let decodedString = '';
        for (let i = 0; i < decodedTokens.length; i++) {
            const currentToken = decodedTokens[i];
            const previousToken = decodedTokens[i - 1];
            if (currentToken != '$' && (previousToken != currentToken || previousToken == undefined)) {
                decodedString += currentToken;
            }
        }
        decodedString = decodedString.trim();
        tokenGroupIndexes = tokenGroupIndexes.filter(group => group.length > 0);
        if (tokenGroupIndexes.length > 0) {
            let currentCorrection = Math.min(tokenGroupIndexes[0][0], 1.5);
            for (let i = 0; i < tokenGroupIndexes.length; i++) {
                const group = tokenGroupIndexes[i];
                if (group.length == 1) {
                    group.push(group[0]);
                }
                group[0] -= currentCorrection;
                if (i == tokenGroupIndexes.length - 1) {
                    currentCorrection = Math.min(tokenCount - i, 1.5);
                }
                else {
                    currentCorrection = Math.min((tokenGroupIndexes[i + 1][0] - group[group.length - 1]) / 2, 1.5);
                }
                group[group.length - 1] += currentCorrection;
            }
        }
        const words = decodedString.split(' ');
        const timeMultiplier = totalDuration / tokenCount;
        const timeline = [];
        for (let i = 0; i < words.length; i++) {
            const text = words[i];
            if (!wordCharacterPattern.test(text)) {
                continue;
            }
            const group = tokenGroupIndexes[i];
            const startTime = group[0] * timeMultiplier;
            const endTime = group[group.length - 1] * timeMultiplier;
            timeline.push({
                type: 'word',
                text: text,
                startTime,
                endTime,
            });
        }
        timeline[timeline.length - 1].endTime = totalDuration;
        return { transcript: decodedString, timeline };
    }
}
export const languageCodeToPackageName = {
    'en': 'silero-en-v5',
    'es': 'silero-es-v1',
    'de': 'silero-de-v1',
    'uk': 'silero-ua-v3',
};
export const defaultSileroRecognitionOptions = {
    modelPath: undefined,
    provider: undefined,
};
//# sourceMappingURL=SileroSTT.js.map