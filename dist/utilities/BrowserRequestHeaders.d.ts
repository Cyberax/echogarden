export declare function getChromeOnWindowsHeaders(options: BrowserRequestHeadersOptions): Record<string, string>;
export declare function getChromeOnAndroidHeaders(options: BrowserRequestHeadersOptions): Record<string, string>;
export interface BrowserRequestHeadersOptions {
    origin: string;
    referrer: string;
}
