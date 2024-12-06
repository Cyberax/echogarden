import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { EngineMetadata } from './Common.js';
import { MDXNetOptions } from '../source-separation/MDXNetSourceSeparation.js';
export declare function isolate(input: AudioSourceParam, options: SourceSeparationOptions): Promise<SourceSeparationResult>;
export type SourceSeparationEngine = 'mdx-net';
export interface SourceSeparationOptions {
    engine?: SourceSeparationEngine;
    mdxNet?: MDXNetOptions;
}
export declare const defaultSourceSeparationOptions: SourceSeparationOptions;
export interface SourceSeparationResult {
    inputRawAudio: RawAudio;
    isolatedRawAudio: RawAudio;
    backgroundRawAudio: RawAudio;
}
export declare const sourceSeparationEngines: EngineMetadata[];
