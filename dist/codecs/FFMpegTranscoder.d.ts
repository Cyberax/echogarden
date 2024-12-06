import { RawAudio } from '../audio/AudioUtilities.js';
export type FFMpegOutputOptions = {
    filename?: string;
    codec?: string;
    format?: string;
    sampleRate?: number;
    sampleFormat?: 'u8' | 's16' | 's32' | 's64' | 'flt' | 'dbl';
    channelCount?: number;
    bitrate?: number;
    audioOnly?: boolean;
    customOptions?: string[];
};
export declare function encodeFromChannels(rawAudio: RawAudio, outputOptions: FFMpegOutputOptions): Promise<Uint8Array<ArrayBufferLike>>;
export declare function decodeToChannels(input: string | Uint8Array, outSampleRate?: number, outChannelCount?: number): Promise<{
    audioChannels: Float32Array<ArrayBufferLike>[];
    sampleRate: number;
}>;
export declare function transcode(input: string | Uint8Array, outputOptions: FFMpegOutputOptions): Promise<Uint8Array<ArrayBufferLike>>;
export declare function getDefaultFFMpegOptionsForSpeech(fileExtension: string, customBitrate?: number): FFMpegOutputOptions;
