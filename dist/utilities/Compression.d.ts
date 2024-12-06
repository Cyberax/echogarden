export declare function createTarball(filePath: string, outputFile: string, prefixPath?: string): Promise<void>;
export declare function createTarballForFile(filePath: string, outputFile: string, prefixPath?: string): Promise<void>;
export declare function createTarballForDir(inputDir: string, outputFile: string, prefixPath?: string): Promise<void>;
export declare function extractTarball(filepath: string, outputDir: string): Promise<void>;
export declare function getDeflateCompressionMetricsForString(str: string): Promise<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
}>;
export declare function computeDeltas(data: Float32Array): Float32Array<ArrayBuffer>;
