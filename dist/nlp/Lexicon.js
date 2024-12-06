import { readAndParseJsonFile } from '../utilities/FileSystem.js';
import { getShortLanguageCode } from '../utilities/Locale.js';
import { resolveToModuleRootDir } from '../utilities/PathUtilities.js';
export function tryGetFirstLexiconSubstitution(sentenceWords, wordIndex, lexicons, languageCode) {
    const reversedLexicons = [...lexicons].reverse(); // Give precedence to later lexicons
    for (const lexicon of reversedLexicons) {
        const match = tryGetLexiconSubstitution(sentenceWords, wordIndex, lexicon, languageCode);
        if (match) {
            return match;
        }
    }
    return undefined;
}
export function tryGetLexiconSubstitution(sentenceWords, wordIndex, lexicon, languageCode) {
    let word = sentenceWords[wordIndex];
    if (!word) {
        return;
    }
    const shortLanguageCode = getShortLanguageCode(languageCode);
    const lexiconForLanguage = lexicon[shortLanguageCode];
    if (!lexiconForLanguage) {
        return;
    }
    const lexiconEntry = lexiconForLanguage[word];
    if (!lexiconEntry) {
        return;
    }
    for (let i = 0; i < lexiconEntry.length; i++) {
        const substitutionEntry = lexiconEntry[i];
        const substitutionPhonemesText = substitutionEntry?.pronunciation?.espeak?.[languageCode];
        if (!substitutionPhonemesText) {
            continue;
        }
        const precedingWord = sentenceWords[wordIndex - 1] || '';
        const succeedingWord = sentenceWords[wordIndex + 1] || '';
        const precededBy = substitutionEntry?.precededBy || [];
        const notPrecededBy = substitutionEntry?.notPrecededBy || [];
        const succeededBy = substitutionEntry?.succeededBy || [];
        const notSucceededBy = substitutionEntry?.notSucceededBy || [];
        const hasNegativePattern = notPrecededBy.includes(precedingWord) || notSucceededBy.includes(succeedingWord);
        const hasPositivePattern = precededBy.includes(precedingWord) || succeededBy.includes(succeedingWord);
        if (i == lexiconEntry.length - 1 || (hasPositivePattern && !hasNegativePattern)) {
            const substitutionPhonemes = substitutionPhonemesText.split(/ +/g);
            return substitutionPhonemes;
        }
    }
    return;
}
export async function loadLexiconFile(jsonFilePath) {
    const parsedLexicon = await readAndParseJsonFile(jsonFilePath);
    return parsedLexicon;
}
export async function loadLexiconsForLanguage(language, customLexiconPaths) {
    const lexicons = [];
    if (getShortLanguageCode(language) == 'en') {
        const heteronymsLexicon = await loadLexiconFile(resolveToModuleRootDir('data/lexicons/heteronyms.en.json'));
        lexicons.push(heteronymsLexicon);
    }
    if (customLexiconPaths && customLexiconPaths.length > 0) {
        for (const customLexicon of customLexiconPaths) {
            const customLexiconObject = await loadLexiconFile(customLexicon);
            lexicons.push(customLexiconObject);
        }
    }
    return lexicons;
}
//# sourceMappingURL=Lexicon.js.map