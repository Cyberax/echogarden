import { request } from 'gaxios';
import * as FFMpegTranscoder from '../codecs/FFMpegTranscoder.js';
import { Logger } from '../utilities/Logger.js';
import { logToStderr } from '../utilities/Utilities.js';
import { extendDeep } from '../utilities/ObjectUtilities.js';
const log = logToStderr;
export async function synthesize(text, voiceId, modelId, options) {
    const logger = new Logger();
    logger.start('Request synthesis from ElevenLabs');
    options = extendDeep(defaultElevenlabsTTSOptions, options);
    let response;
    try {
        response = await request({
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            method: 'POST',
            headers: {
                'accept': 'audio/mpeg',
                'xi-api-key': options.apiKey,
            },
            data: {
                text,
                model_id: modelId,
                voice_setting: {
                    stability: options.stability,
                    similarity_boost: options.similarityBoost,
                    style: options.style,
                    use_speaker_boost: options.useSpeakerBoost
                }
            },
            responseType: 'arraybuffer'
        });
    }
    catch (e) {
        const response = e.response;
        if (response) {
            logger.log(`Request failed with status code ${response.status}`);
            if (response.data) {
                logger.log(`Server responded with:`);
                logger.log(response.data);
            }
        }
        throw e;
    }
    logger.start('Decode synthesized audio');
    const rawAudio = await FFMpegTranscoder.decodeToChannels(new Uint8Array(response.data));
    logger.end();
    return { rawAudio };
}
export async function getVoiceList(apiKey) {
    const response = await request({
        method: 'GET',
        url: 'https://api.elevenlabs.io/v1/voices',
        headers: {
            'accept': 'accept: application/json',
            'xi-api-key': apiKey
        },
        responseType: 'json'
    });
    const elevenlabsVoices = response.data.voices;
    const voices = elevenlabsVoices.map(elevenlabsVoice => {
        const modelId = elevenlabsVoice?.high_quality_base_model_ids?.[0] ?? 'eleven_monolingual_v1';
        const accent = elevenlabsVoice?.labels?.accent;
        const gender = elevenlabsVoice?.labels?.gender ?? 'unknown';
        const supportedLanguages = [];
        if (accent) {
            if (accent.startsWith('american')) {
                supportedLanguages.push('en-US');
            }
            else if (accent.startsWith('british')) {
                supportedLanguages.push('en-GB');
            }
            else if (accent === 'irish') {
                supportedLanguages.push('en-IE');
            }
            else if (accent == 'australian') {
                supportedLanguages.push('en-AU');
            }
        }
        if (modelId.includes('multilingual')) {
            supportedLanguages.push('en', ...supporteMultilingualLanguages);
        }
        else {
            supportedLanguages.push('en');
        }
        return {
            name: elevenlabsVoice.name,
            languages: supportedLanguages,
            gender,
            elevenLabsVoiceId: elevenlabsVoice.voice_id,
            elevenLabsModelId: modelId
        };
    });
    return voices;
}
export const defaultElevenlabsTTSOptions = {
    apiKey: undefined,
    stability: 0.5,
    similarityBoost: 0.5,
    style: 0,
    useSpeakerBoost: true
};
export const supporteMultilingualLanguages = ['zh', 'ko', 'nl', 'tr', 'sv', 'id', 'tl', 'ja', 'uk', 'el', 'cs', 'fi', 'ro', 'ru', 'da', 'bg', 'ms', 'sk', 'hr', 'ar', 'ta', 'pl', 'de', 'es', 'fr', 'it', 'hi', 'pt'];
//# sourceMappingURL=ElevenlabsTTS.js.map