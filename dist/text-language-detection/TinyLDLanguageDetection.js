import { detectAll } from 'tinyld';
import { languageCodeToName } from '../utilities/Locale.js';
export async function detectLanguage(text) {
    const tinyldResults = detectAll(text);
    const results = tinyldResults.map(result => ({
        language: result.lang,
        languageName: languageCodeToName(result.lang),
        probability: result.accuracy
    }));
    return results;
}
//# sourceMappingURL=TinyLDLanguageDetection.js.map