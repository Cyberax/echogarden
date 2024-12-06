import { softmax } from '../math/VectorMath.js';
import { Logger } from '../utilities/Logger.js';
import { readAndParseJsonFile } from '../utilities/FileSystem.js';
import { detectSpeechLanguageByParts } from '../api/SpeechLanguageDetection.js';
import { languageCodeToName } from '../utilities/Locale.js';
import { getOnnxSessionOptions } from '../utilities/OnnxUtilities.js';
export async function detectLanguage(rawAudio, modelPath, languageDictionaryPath, languageGroupDictionaryPath, onnxExecutionProviders) {
    const languageDetection = new SileroLanguageDetection(modelPath, languageDictionaryPath, languageGroupDictionaryPath, onnxExecutionProviders);
    async function detectLanguageForPart(partAudio) {
        const { languageResults } = await languageDetection.detectLanguage(partAudio);
        return languageResults;
    }
    const results = await detectSpeechLanguageByParts(rawAudio, detectLanguageForPart);
    results.sort((a, b) => b.probability - a.probability);
    return results;
}
export class SileroLanguageDetection {
    modelPath;
    languageDictionaryPath;
    languageGroupDictionaryPath;
    onnxExecutionProviders;
    languageDictionary;
    languageGroupDictionary;
    session;
    constructor(modelPath, languageDictionaryPath, languageGroupDictionaryPath, onnxExecutionProviders) {
        this.modelPath = modelPath;
        this.languageDictionaryPath = languageDictionaryPath;
        this.languageGroupDictionaryPath = languageGroupDictionaryPath;
        this.onnxExecutionProviders = onnxExecutionProviders;
    }
    async detectLanguage(rawAudio) {
        await this.initializeIfNeeded();
        const logger = new Logger();
        logger.start('Detect language with Silero');
        const audioSamples = rawAudio.audioChannels[0];
        const Onnx = await import('onnxruntime-node');
        const inputTensor = new Onnx.Tensor('float32', audioSamples, [1, audioSamples.length]);
        const inputs = { input: inputTensor };
        const results = await this.session.run(inputs);
        logger.start('Parse model results');
        const languageLogits = results['output'].data;
        const languageGroupLogits = results['2038'].data;
        const languageProbabilities = softmax(languageLogits);
        const languageGroupProbabilities = softmax(languageGroupLogits);
        const languageResults = [];
        for (let i = 0; i < languageProbabilities.length; i++) {
            const languageString = this.languageDictionary[i];
            const languageCode = languageString.replace(/,.*$/, '');
            languageResults.push({
                language: languageCode,
                languageName: languageCodeToName(languageCode),
                probability: languageProbabilities[i]
            });
        }
        const languageGroupResults = [];
        for (let i = 0; i < languageGroupProbabilities.length; i++) {
            languageGroupResults.push({
                languageGroup: this.languageGroupDictionary[i],
                probability: languageGroupProbabilities[i]
            });
        }
        logger.end();
        return { languageResults, languageGroupResults };
    }
    async initializeIfNeeded() {
        if (this.session) {
            return;
        }
        const logger = new Logger();
        logger.start('Initialize ONNX inference session for Silero language detection');
        this.languageDictionary = await readAndParseJsonFile(this.languageDictionaryPath);
        this.languageGroupDictionary = await readAndParseJsonFile(this.languageGroupDictionaryPath);
        const Onnx = await import('onnxruntime-node');
        const onnxSessionOptions = getOnnxSessionOptions({ executionProviders: this.onnxExecutionProviders });
        this.session = await Onnx.InferenceSession.create(this.modelPath, onnxSessionOptions);
        logger.end();
    }
}
export const defaultSileroLanguageDetectionOptions = {
    provider: undefined
};
//# sourceMappingURL=SileroLanguageDetection.js.map