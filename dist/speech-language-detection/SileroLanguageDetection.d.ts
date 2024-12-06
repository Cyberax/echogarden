import type * as Onnx from 'onnxruntime-node';
import { RawAudio } from '../audio/AudioUtilities.js';
import { OnnxExecutionProvider } from '../utilities/OnnxUtilities.js';
import { LanguageDetectionResults } from '../api/LanguageDetectionCommon.js';
export declare function detectLanguage(rawAudio: RawAudio, modelPath: string, languageDictionaryPath: string, languageGroupDictionaryPath: string, onnxExecutionProviders: OnnxExecutionProvider[]): Promise<LanguageDetectionResults>;
export declare class SileroLanguageDetection {
    readonly modelPath: string;
    readonly languageDictionaryPath: string;
    readonly languageGroupDictionaryPath: string;
    readonly onnxExecutionProviders: OnnxExecutionProvider[];
    languageDictionary?: any;
    languageGroupDictionary?: any;
    session?: Onnx.InferenceSession;
    constructor(modelPath: string, languageDictionaryPath: string, languageGroupDictionaryPath: string, onnxExecutionProviders: OnnxExecutionProvider[]);
    detectLanguage(rawAudio: RawAudio): Promise<{
        languageResults: LanguageDetectionResults;
        languageGroupResults: {
            languageGroup: string;
            probability: number;
        }[];
    }>;
    initializeIfNeeded(): Promise<void>;
}
export interface SileroLanguageDetectionOptions {
    provider?: OnnxExecutionProvider;
}
export declare const defaultSileroLanguageDetectionOptions: SileroLanguageDetectionOptions;
