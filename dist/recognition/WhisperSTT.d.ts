import type * as Onnx from 'onnxruntime-node';
import { Filterbank } from '../dsp/MelSpectogram.js';
import { Timeline } from '../utilities/Timeline.js';
import { AlignmentPath } from '../alignment/SpeechAlignment.js';
import { RawAudio } from '../audio/AudioUtilities.js';
import type { LanguageDetectionResults } from '../api/API.js';
import { XorShift32PRNG } from '../utilities/RandomGenerator.js';
import { type Tiktoken } from 'tiktoken/lite';
import { OnnxExecutionProvider, OnnxLikeFloat32Tensor } from '../utilities/OnnxUtilities.js';
export declare function recognize(sourceRawAudio: RawAudio, modelName: WhisperModelName, modelDir: string, task: WhisperTask, sourceLanguage: string, options: WhisperOptions): Promise<{
    transcript: string;
    timeline: Timeline;
    allDecodedTokens: number[];
}>;
export declare function align(sourceRawAudio: RawAudio, transcript: string, modelName: WhisperModelName, modelDir: string, sourceLanguage: string, options: WhisperAlignmentOptions): Promise<Timeline>;
export declare function alignEnglishTranslation(sourceRawAudio: RawAudio, translatedTranscript: string, modelName: WhisperModelName, modelDir: string, sourceLanguage: string, options: WhisperAlignmentOptions): Promise<Timeline>;
export declare function detectLanguage(sourceRawAudio: RawAudio, modelName: WhisperModelName, modelDir: string, options: WhisperLanguageDetectionOptions): Promise<LanguageDetectionResults>;
export declare function detectVoiceActivity(sourceRawAudio: RawAudio, modelName: WhisperModelName, modelDir: string, options: WhisperVADOptions): Promise<{
    partProbabilities: Timeline;
}>;
export declare class Whisper {
    readonly modelName: WhisperModelName;
    readonly modelDir: string;
    readonly encoderExecutionProviders: OnnxExecutionProvider[];
    readonly decoderExecutionProviders: OnnxExecutionProvider[];
    isMultiligualModel: boolean;
    audioEncoder?: Onnx.InferenceSession;
    textDecoder?: Onnx.InferenceSession;
    tiktoken?: Tiktoken;
    tokenConfig: {
        endOfTextToken: number;
        startOfTextToken: number;
        languageTokensStart: number;
        languageTokensEnd: number;
        translateTaskToken: number;
        transcribeTaskToken: number;
        startOfPromptToken: number;
        nonSpeechToken: number;
        noTimestampsToken: number;
        timestampTokensStart: number;
        timestampTokensEnd: number;
    };
    randomGen: XorShift32PRNG;
    constructor(modelName: WhisperModelName, modelDir: string, encoderExecutionProviders: OnnxExecutionProvider[], decoderExecutionProviders: OnnxExecutionProvider[], prngSeed?: number);
    recognize(rawAudio: RawAudio, task: WhisperTask, language: string, options: WhisperOptions, logitFilter?: WhisperLogitFilter): Promise<{
        transcript: string;
        timeline: Timeline;
        allDecodedTokens: number[];
    }>;
    align(rawAudio: RawAudio, transcript: string, sourceLanguage: string, task: 'transcribe' | 'translate', whisperAlignmentOptions: WhisperAlignmentOptions): Promise<Timeline>;
    detectLanguage(audioFeatures: Onnx.Tensor, temperature: number): Promise<LanguageDetectionResults>;
    detectVoiceActivity(audioFeatures: Onnx.Tensor, temperature: number): Promise<number>;
    decodeTokens(audioFeatures: Onnx.Tensor, initialTokens: number[], audioDuration: number, isFirstPart: boolean, isFinalPart: boolean, options: WhisperOptions, logitFilter?: WhisperLogitFilter): Promise<{
        decodedTokens: number[];
        decodedTokensTimestampLogits: number[][];
        decodedTokensConfidence: number[];
        decodedTokensCrossAttentionQKs: OnnxLikeFloat32Tensor[];
    }>;
    encodeAudio(rawAudio: RawAudio): Promise<Onnx.Tensor>;
    tokenTimelineToWordTimeline(tokenTimeline: Timeline, language: string): Timeline;
    getTokenTimelineFromAlignmentPath(alignmentPath: AlignmentPath, tokens: number[], startTimeOffset: number, endTimeOffset: number, tokensConfidence?: number[], correctionAmount?: number): Promise<Timeline>;
    findAlignmentPathFromQKs(qksTensors: OnnxLikeFloat32Tensor[], tokens: number[], segmentStartFrame: number, segmentEndFrame: number, headIndexes?: number[]): Promise<AlignmentPath>;
    initializeIfNeeded(): Promise<void>;
    initializeTokenizerIfNeeded(): Promise<void>;
    initializeEncoderSessionIfNeeded(): Promise<void>;
    initializeDecoderSessionIfNeeded(): Promise<void>;
    getKvDimensions(groupCount: number, length: number): number[];
    getTextStartTokens(language: string, task: WhisperTask, disableTimestamps?: boolean): number[];
    tokenToText(token: number, includeMetadataTokens?: boolean): string;
    tokensToText(tokens: number[], includeMetadataTokens?: boolean): string;
    textToTokens(text: string): number[];
    isTextToken(token: number): boolean;
    isMetadataToken(token: number): boolean;
    isLanguageToken(token: number): boolean;
    isTimestampToken(token: number): boolean;
    isNonTimestampToken(token: number): boolean;
    timestampTokenToSeconds(timestampToken: number): number;
    isValidToken(token: number): boolean;
    assertIsValidToken(token: number): void;
    secondsToFrame(seconds: number): number;
    secondsRangeToFrameCount(startSeconds: number, endSeconds: number): number;
    languageTokenToLanguageIndex(languageToken: number): void;
    get isEnglishOnlyModel(): boolean;
    get isLargeModel(): boolean;
    get filterbankCount(): 128 | 80;
    get filterbanks(): Filterbank[];
    get alignmentHeadIndexes(): number[];
    get defaultTimestampAccuracy(): "medium" | "high";
    getSuppressedTokens(): number[];
    getSuppressedTextTokens(): number[];
    getSuppressedMetadataTokens(): number[];
    getAllowedPunctuationMarks(): string[];
    getWordTokenData(): {
        wordTokenData: WhisperTokenData[];
        nonWordTokenData: WhisperTokenData[];
    };
    getTokensData(tokens: number[]): WhisperTokenData[];
}
export declare function loadPackagesAndGetPaths(modelName: WhisperModelName | undefined, languageCode: string | undefined): Promise<{
    modelName: WhisperModelName;
    modelDir: string;
}>;
export declare function normalizeWhisperModelName(modelName: WhisperModelName, languageCode: string | undefined): WhisperModelName;
export declare function isMultilingualModel(modelName: WhisperModelName): boolean;
export declare function isEnglishOnlyModel(modelName: WhisperModelName): boolean;
export declare function getDefaultEncoderProvidersForModel(modelName: WhisperModelName): OnnxExecutionProvider[];
export declare function getDefaultDecoderProvidersForModel(modelName: WhisperModelName): OnnxExecutionProvider[];
export type WhisperTokenData = {
    id: number;
    text: string;
};
export type WhisperLogitFilter = (logits: number[], decodedTokens: number[], isFirstPart: boolean, isFinalPart: boolean) => number[];
export type WhisperModelName = 'tiny' | 'tiny.en' | 'base' | 'base.en' | 'small' | 'small.en' | 'medium' | 'medium.en' | 'large-v1' | 'large-v2' | 'large-v3' | 'large-v3-turbo';
export type WhisperTask = 'transcribe' | 'translate' | 'detect-language';
export declare const modelNameToPackageName: {
    [modelName in WhisperModelName]: string;
};
export declare const tokenizerPackageName = "whisper-tokenizer";
export interface WhisperOptions {
    model?: WhisperModelName;
    temperature?: number;
    prompt?: string;
    topCandidateCount?: number;
    punctuationThreshold?: number;
    autoPromptParts?: boolean;
    maxTokensPerPart?: number;
    suppressRepetition?: boolean;
    repetitionThreshold?: number;
    decodeTimestampTokens?: boolean;
    endTokenThreshold?: number;
    includeEndTokenInCandidates?: boolean;
    timestampAccuracy?: WhisperTimestampAccuracy;
    encoderProvider?: OnnxExecutionProvider;
    decoderProvider?: OnnxExecutionProvider;
    seed?: number;
}
export declare const defaultWhisperOptions: WhisperOptions;
export interface WhisperAlignmentOptions {
    model?: WhisperModelName;
    endTokenThreshold?: number;
    maxTokensPerPart?: number;
    timestampAccuracy?: WhisperTimestampAccuracy;
    encoderProvider?: OnnxExecutionProvider;
    decoderProvider?: OnnxExecutionProvider;
}
export declare const defaultWhisperAlignmentOptions: WhisperAlignmentOptions;
export interface WhisperLanguageDetectionOptions {
    model?: WhisperModelName;
    temperature?: number;
    encoderProvider?: OnnxExecutionProvider;
    decoderProvider?: OnnxExecutionProvider;
}
export declare const defaultWhisperLanguageDetectionOptions: WhisperLanguageDetectionOptions;
export interface WhisperVADOptions {
    model?: WhisperModelName;
    temperature?: number;
    encoderProvider?: OnnxExecutionProvider;
    decoderProvider?: OnnxExecutionProvider;
}
export declare const defaultWhisperVADOptions: WhisperVADOptions;
type WhisperTimestampAccuracy = 'medium' | 'high';
export {};
