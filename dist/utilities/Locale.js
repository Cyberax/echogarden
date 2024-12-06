import { readAndParseJsonFile } from './FileSystem.js';
import { resolveToModuleRootDir } from './PathUtilities.js';
export function languageCodeToName(languageCode) {
    const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
    let translatedLanguageName;
    try {
        translatedLanguageName = languageNames.of(languageCode);
    }
    catch (e) {
    }
    return translatedLanguageName || 'Unknown';
}
export function formatLanguageCodeWithName(languageCode, styleId = 1) {
    if (styleId == 1) {
        return `${languageCodeToName(languageCode)} (${languageCode})`;
    }
    else {
        return `${languageCode}, ${languageCodeToName(languageCode)}`;
    }
}
export async function normalizeIdentifierToLanguageCode(langIdentifier) {
    const result = await parseLangIdentifier(langIdentifier);
    return result.Name;
}
export async function normalizeIdentifierToShortLanguageCode(langIdentifier) {
    const result = await parseLangIdentifier(langIdentifier);
    return result.TwoLetterISOLanguageName;
}
export async function parseLangIdentifier(langIdentifier) {
    if (!langIdentifier) {
        return emptyLangInfoEntry;
    }
    await loadLangInfoEntriesIfNeeded();
    langIdentifier = langIdentifier.trim().toLowerCase();
    for (const entry of langInfoEntries) {
        if (langIdentifier === entry.NameLowerCase ||
            langIdentifier === entry.ThreeLetterISOLanguageName ||
            langIdentifier === entry.EnglishNameLowerCase) {
            return entry;
        }
    }
    throw new Error(`Couldn't parse language identifier '${langIdentifier}'.`);
}
export function getShortLanguageCode(langCode) {
    const dashIndex = langCode.indexOf('-');
    if (dashIndex == -1) {
        return langCode;
    }
    return langCode.substring(0, dashIndex).toLowerCase();
}
export function normalizeLanguageCode(langCode) {
    langCode = langCode.trim();
    const parts = langCode.split('-');
    const result = [parts[0].toLowerCase()];
    for (let i = 1; i < parts.length; i++) {
        result.push(parts[i].toUpperCase());
    }
    return result.join('-');
}
const isoToLcidLookup = new Map();
const lcidToIsoLookup = new Map();
let langInfoEntries = [];
export async function isoToLcidLanguageCode(iso) {
    await loadLcidLookupIfNeeded();
    return isoToLcidLookup.get(iso);
}
export async function lcidToIsoLanguageCode(lcid) {
    await loadLcidLookupIfNeeded();
    return lcidToIsoLookup.get(lcid);
}
async function loadLcidLookupIfNeeded() {
    await loadLangInfoEntriesIfNeeded();
    for (const lcidEntry of langInfoEntries) {
        const name = lcidEntry.Name;
        const lcidValue = lcidEntry.LCID;
        isoToLcidLookup.set(name, lcidValue);
        let entry = lcidToIsoLookup.get(lcidValue);
        if (!entry) {
            entry = [];
            lcidToIsoLookup.set(lcidValue, entry);
        }
        entry.push(name);
    }
    return langInfoEntries;
}
async function loadLangInfoEntriesIfNeeded() {
    if (langInfoEntries.length > 0) {
        return;
    }
    const entries = await readAndParseJsonFile(resolveToModuleRootDir('data/tables/lcid-table.json'));
    for (const entry of entries) {
        entry.NameLowerCase = entry.Name.toLowerCase();
        entry.EnglishNameLowerCase = entry.EnglishName.toLowerCase();
        langInfoEntries.push(entry);
    }
}
export function getDefaultDialectForLanguageCodeIfPossible(langCode) {
    const defaultDialect = defaultDialectForLanguageCode[langCode];
    return defaultDialect || langCode;
}
export const defaultDialectForLanguageCode = {
    'en': 'en-US',
    'zh': 'zh-CN',
    'ar': 'ar-EG',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'pt': 'pt-BR',
    'es': 'es-ES',
    'nl': 'nl-NL'
};
export const emptyLangInfoEntry = {
    LCID: -1,
    Name: '',
    NameLowerCase: '',
    TwoLetterISOLanguageName: '',
    ThreeLetterISOLanguageName: '',
    ThreeLetterWindowsLanguageName: '',
    EnglishName: 'Empty',
    EnglishNameLowerCase: 'empty',
    ANSICodePage: ''
};
//# sourceMappingURL=Locale.js.map