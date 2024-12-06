import { GaxiosOptions } from 'gaxios';
export declare function downloadAndExtractTarball(options: GaxiosOptions, targetDir: string, baseTempPath: string, displayName?: string): Promise<void>;
export declare function downloadFile(options: GaxiosOptions, targetFilePath: string, prompt?: string): Promise<void>;
