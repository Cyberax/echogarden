export declare function getOptionTypeFromSchema(path: string[], schema: any): SchemaTypeDefinition;
export type SchemaTypeDefinition = {
    type?: string;
    enum?: any[];
    isUnion?: boolean;
};
