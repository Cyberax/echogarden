export declare function languageCodeToName(languageCode: string): string;
export declare function formatLanguageCodeWithName(languageCode: string, styleId?: 1 | 2): string;
export declare function normalizeIdentifierToLanguageCode(langIdentifier: string): Promise<string>;
export declare function normalizeIdentifierToShortLanguageCode(langIdentifier: string): Promise<string>;
export declare function parseLangIdentifier(langIdentifier: string): Promise<LangInfoEntry>;
export declare function getShortLanguageCode(langCode: string): string;
export declare function normalizeLanguageCode(langCode: string): string;
export declare function isoToLcidLanguageCode(iso: string): Promise<number | undefined>;
export declare function lcidToIsoLanguageCode(lcid: number): Promise<string[] | undefined>;
export declare function getDefaultDialectForLanguageCodeIfPossible(langCode: string): string;
export declare const defaultDialectForLanguageCode: {
    [lang: string]: string;
};
export interface LangInfoEntry {
    LCID: number;
    Name: string;
    NameLowerCase: string;
    TwoLetterISOLanguageName: string;
    ThreeLetterISOLanguageName: string;
    ThreeLetterWindowsLanguageName: string;
    EnglishName: string;
    EnglishNameLowerCase: string;
    ANSICodePage: string;
}
export declare const emptyLangInfoEntry: LangInfoEntry;
