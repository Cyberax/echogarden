import { getShortLanguageCode } from '../utilities/Locale.js';
import { logToStderr } from '../utilities/Utilities.js';
const log = logToStderr;
export async function parse(text) {
    const { default: nlp } = await import('compromise');
    const doc = nlp(text);
    doc.compute('penn');
    const jsonDoc = doc.json({ offset: true });
    //log(jsonDoc)
    const result = jsonDoc.map(sentence => {
        const terms = sentence.terms;
        const parsedSentence = [];
        for (let termIndex = 0; termIndex < terms.length; termIndex++) {
            const term = terms[termIndex];
            const parsedTerm = {
                text: term.text,
                pos: term.penn,
                tags: term.tags,
                preText: term.pre,
                postText: term.post,
                startOffset: term.offset.start,
                endOffset: term.offset.start + term.offset.length
            };
            if (parsedTerm.text == '') {
                if (parsedSentence.length > 0) {
                    parsedSentence[parsedSentence.length - 1].postText += parsedTerm.preText + parsedTerm.postText;
                }
            }
            else if (parsedTerm.tags.includes('Abbreviation') && parsedTerm.postText.startsWith('.')) {
                parsedTerm.text += '.';
                parsedTerm.endOffset += 1;
                parsedSentence.push(parsedTerm);
            }
            else {
                parsedSentence.push(parsedTerm);
            }
        }
        return parsedSentence;
    });
    //log(result)
    return result;
}
export function tryMatchInLexicons(term, lexicons, espeakVoice) {
    const reversedLexicons = [...lexicons].reverse(); // Give precedence to later lexicons
    for (const lexicon of reversedLexicons) {
        const match = tryMatchInLexicon(term, lexicon, espeakVoice);
        if (match) {
            return match;
        }
    }
    return undefined;
}
export function tryMatchInLexicon(term, lexicon, espeakVoice) {
    const shortLanguageCode = getShortLanguageCode(espeakVoice);
    const lexiconForLanguage = lexicon[shortLanguageCode];
    if (!lexiconForLanguage) {
        return undefined;
    }
    const termText = term.text;
    const lowerCaseTermText = termText.toLocaleLowerCase();
    const entry = lexiconForLanguage[lowerCaseTermText];
    if (!entry) {
        return undefined;
    }
    for (const substitutionEntry of entry) {
        if (!substitutionEntry.pos || substitutionEntry.pos.includes(term.pos)) {
            const substitutionPhonemesText = substitutionEntry?.pronunciation?.espeak?.[espeakVoice];
            if (substitutionPhonemesText) {
                const substitutionPhonemes = substitutionPhonemesText.split(/ +/g);
                return substitutionPhonemes;
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=CompromiseNLP.js.map