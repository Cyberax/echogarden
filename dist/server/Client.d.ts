import { WebSocket } from 'ws';
import { RequestVoiceListResult, SynthesisOptions, SynthesisSegmentEvent, SynthesisResult, VoiceListRequestOptions } from '../api/Synthesis.js';
import { AudioSourceParam, RawAudio } from '../audio/AudioUtilities.js';
import { AlignmentOptions, AlignmentResult } from '../api/Alignment.js';
import { RecognitionOptions, RecognitionResult } from '../api/Recognition.js';
import { SpeechTranslationOptions, SpeechTranslationResult } from '../api/SpeechTranslation.js';
import { Worker as WorkerThread } from 'node:worker_threads';
import { SpeechLanguageDetectionOptions, SpeechLanguageDetectionResult } from '../api/SpeechLanguageDetection.js';
import { TextLanguageDetectionOptions, TextLanguageDetectionResult } from '../api/TextLanguageDetection.js';
export declare class Client {
    sendMessage: (message: any) => void;
    responseListeners: Map<string, (message: string) => void>;
    constructor(sourceChannel: WebSocket | WorkerThread);
    synthesize(input: string | string[], options: SynthesisOptions, onSegment?: SynthesisSegmentEvent, onSentence?: SynthesisSegmentEvent): Promise<SynthesisResult>;
    requestVoiceList(options: VoiceListRequestOptions): Promise<RequestVoiceListResult>;
    recognize(input: AudioSourceParam, options: RecognitionOptions): Promise<RecognitionResult>;
    align(input: AudioSourceParam, transcript: string, options: AlignmentOptions): Promise<AlignmentResult>;
    translateSpeech(input: string | Uint8Array | RawAudio, options: SpeechTranslationOptions): Promise<SpeechTranslationResult>;
    detectSpeechLanguage(input: AudioSourceParam, options: SpeechLanguageDetectionOptions): Promise<SpeechLanguageDetectionResult>;
    detectTextLanguage(input: string, options: TextLanguageDetectionOptions): Promise<TextLanguageDetectionResult>;
    sendRequest(request: any, onResponse: (message: any) => void, onErrorResponse: (error: any) => void): void;
    onMessage(incomingMessage: any): void;
}
