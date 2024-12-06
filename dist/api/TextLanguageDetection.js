import { extendDeep } from '../utilities/ObjectUtilities.js';
import { Logger } from '../utilities/Logger.js';
import { logToStderr } from '../utilities/Utilities.js';
import { languageCodeToName } from '../utilities/Locale.js';
const log = logToStderr;
export async function detectTextLanguage(input, options) {
    const logger = new Logger();
    options = extendDeep(defaultTextLanguageDetectionOptions, options);
    const defaultLanguage = options.defaultLanguage;
    const fallbackThresholdProbability = options.fallbackThresholdProbability;
    let detectedLanguageProbabilities;
    logger.start(`Initialize ${options.engine} module`);
    switch (options.engine) {
        case 'tinyld': {
            const { detectLanguage } = await import('../text-language-detection/TinyLDLanguageDetection.js');
            logger.start('Detect text language using tinyld');
            detectedLanguageProbabilities = await detectLanguage(input);
            break;
        }
        case 'fasttext': {
            const { detectLanguage } = await import('../text-language-detection/FastTextLanguageDetection.js');
            logger.start('Detect text language using FastText');
            detectedLanguageProbabilities = await detectLanguage(input);
            break;
        }
        default: {
            throw new Error(`Engine '${options.engine}' is not supported`);
        }
    }
    let detectedLanguage;
    if (detectedLanguageProbabilities.length == 0 ||
        detectedLanguageProbabilities[0].probability < fallbackThresholdProbability) {
        detectedLanguage = defaultLanguage;
    }
    else {
        detectedLanguage = detectedLanguageProbabilities[0].language;
    }
    logger.end();
    return {
        detectedLanguage,
        detectedLanguageName: languageCodeToName(detectedLanguage),
        detectedLanguageProbabilities
    };
}
/////////////////////////////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////////////////////////////
export const defaultTextLanguageDetectionOptions = {
    engine: 'tinyld',
    defaultLanguage: 'en',
    fallbackThresholdProbability: 0.05,
};
export const textLanguageDetectionEngines = [
    {
        id: 'tinyld',
        name: 'TinyLD',
        description: 'A simple language detection library.',
        type: 'local'
    },
    {
        id: 'fasttext',
        name: 'FastText',
        description: 'A library for word representations and sentence classification by Facebook research.',
        type: 'local'
    },
];
//# sourceMappingURL=TextLanguageDetection.js.map