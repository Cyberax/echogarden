import { RequestVoiceListResult, SynthesisOptions, SynthesisSegmentEventData, SynthesisResult, VoiceListRequestOptions } from '../api/Synthesis.js';
import { AudioSourceParam } from '../audio/AudioUtilities.js';
import { RecognitionOptions, RecognitionResult } from '../api/Recognition.js';
import { AlignmentOptions, AlignmentResult } from '../api/Alignment.js';
import { SpeechTranslationOptions, SpeechTranslationResult } from '../api/SpeechTranslation.js';
import { Worker } from 'node:worker_threads';
import { SpeechLanguageDetectionOptions, SpeechLanguageDetectionResult } from '../api/SpeechLanguageDetection.js';
import { TextLanguageDetectionOptions, TextLanguageDetectionResult } from '../api/TextLanguageDetection.js';
export declare function startMessageChannel(): void;
export declare function shouldCancelCurrentTask(): boolean;
export declare function processMessage(message: WorkerRequestMessage, sendMessage: MessageFunc): Promise<void>;
export interface SynthesisRequestMessage extends WorkerMessageBase {
    messageType: 'SynthesisRequest';
    input: string | string[];
    options: SynthesisOptions;
}
export interface SynthesisResponseMessage extends WorkerMessageBase, SynthesisResult {
    messageType: 'SynthesisResponse';
}
export interface SynthesisSegmentEventMessage extends WorkerMessageBase, SynthesisSegmentEventData {
    messageType: 'SynthesisSegmentEvent';
}
export interface SynthesisSentenceEventMessage extends WorkerMessageBase, SynthesisSegmentEventData {
    messageType: 'SynthesisSentenceEvent';
}
export interface VoiceListRequestMessage extends WorkerMessageBase {
    messageType: 'VoiceListRequest';
    options: VoiceListRequestOptions;
}
export interface VoiceListResponseMessage extends WorkerMessageBase, RequestVoiceListResult {
    messageType: 'VoiceListResponse';
}
export interface RecognitionRequestMessage extends WorkerMessageBase {
    messageType: 'RecognitionRequest';
    input: AudioSourceParam;
    options: RecognitionOptions;
}
export interface RecognitionResponseMessage extends WorkerMessageBase, RecognitionResult {
    messageType: 'RecognitionResponse';
}
export interface AlignmentRequestMessage extends WorkerMessageBase {
    messageType: 'AlignmentRequest';
    input: AudioSourceParam;
    transcript: string;
    options: AlignmentOptions;
}
export interface AlignmentResponseMessage extends WorkerMessageBase, AlignmentResult {
    messageType: 'AlignmentResponse';
}
export interface SpeechTranslationRequestMessage extends WorkerMessageBase {
    messageType: 'SpeechTranslationRequest';
    input: AudioSourceParam;
    options: SpeechTranslationOptions;
}
export interface SpeechTranslationResponseMessage extends WorkerMessageBase, SpeechTranslationResult {
    messageType: 'SpeechTranslationResponse';
}
export interface SpeechLanguageDetectionRequestMessage extends WorkerMessageBase {
    messageType: 'SpeechLanguageDetectionRequest';
    input: AudioSourceParam;
    options: SpeechLanguageDetectionOptions;
}
export interface SpeechLanguageDetectionResponseMessage extends WorkerMessageBase, SpeechLanguageDetectionResult {
    messageType: 'SpeechLanguageDetectionResponse';
}
export interface TextLanguageDetectionRequestMessage extends WorkerMessageBase {
    messageType: 'TextLanguageDetectionRequest';
    input: string;
    options: TextLanguageDetectionOptions;
}
export interface TextLanguageDetectionResponseMessage extends WorkerMessageBase, TextLanguageDetectionResult {
    messageType: 'TextLanguageDetectionResponse';
}
export declare function sendMessageToWorker(message: any): void;
export declare function addListenerToWorkerMessages(handler: MessageFunc): void;
export declare function startNewWorkerThread(): Promise<Worker>;
export type WorkerRequestMessage = SynthesisRequestMessage | VoiceListRequestMessage | RecognitionRequestMessage | AlignmentRequestMessage | SpeechTranslationRequestMessage | SpeechLanguageDetectionRequestMessage | TextLanguageDetectionRequestMessage;
export interface WorkerMessageBase {
    messageType: string;
}
export type MessageFunc = (message: any) => void;
