export declare function parseConfigFile(path: string): Promise<ParsedConfigFile>;
export declare function parseJSONConfigFile(path: string): Promise<ParsedConfigFile>;
export type ParsedConfigFile = Map<string, Map<string, string>>;
