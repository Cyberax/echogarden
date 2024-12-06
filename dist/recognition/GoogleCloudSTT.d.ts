import { Timeline } from '../utilities/Timeline.js';
import { RawAudio } from '../audio/AudioUtilities.js';
export type AudioEncoding = 'LINEAR16' | 'FLAC' | 'MULAW' | 'AMR' | 'AMR' | 'AMR_WB' | 'OGG_OPUS' | 'SPEEX_WITH_HEADER_BYTE' | 'MP3' | 'WEBM_OPUS';
export declare function recognize(rawAudio: RawAudio, apiKey: string, languageCode?: string): Promise<{
    transcript: string;
    timeline: Timeline;
}>;
