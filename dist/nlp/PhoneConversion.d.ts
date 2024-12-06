export declare function ipaPhoneToKirshenbaum(ipaPhone: string): string;
export declare function ipaWordToTimitTokens(ipaWord: string, subphoneCount?: number): string[];
export declare function ipaPhoneToTimit(ipaPhone: string, subphoneCount?: number): string[] | undefined;
export declare function arpabetPhoneToIpa(arpabetPhone: string): string | undefined;
export declare function timitPhoneToIpa(arpabetPhone: string): string | undefined;
export declare function splitTokensToSubphones(tokens: string[], subphoneCount?: number): string[];
