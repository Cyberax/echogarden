export declare function parseCLIArguments(args: string[]): ParsedCLIArguments;
export interface ParsedCLIArguments {
    operationArgs: string[];
    parsedArgumentsLookup: Map<string, string>;
}
