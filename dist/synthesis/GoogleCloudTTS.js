import { request } from 'gaxios';
import { Logger } from '../utilities/Logger.js';
import { logToStderr } from '../utilities/Utilities.js';
import { decodeBase64 } from '../encodings/Base64.js';
const log = logToStderr;
export async function synthesize(text, apiKey, languageCode = 'en-US', voice = 'en-US-Wavenet-C', speakingRate = 1.0, pitchDeltaSemitones = 0.0, volumeGainDecibels = 0.0, ssml = false, audioEncoding = 'MP3_64_KBPS', sampleRate = 24000) {
    const logger = new Logger();
    logger.start('Request synthesis from Google Cloud');
    const requestBody = {
        input: {
            text: undefined,
            ssml: undefined
        },
        voice: {
            languageCode,
            name: voice
        },
        audioConfig: {
            audioEncoding,
            speakingRate,
            pitch: pitchDeltaSemitones,
            volumeGainDb: volumeGainDecibels,
            sampleRateHertz: sampleRate
        },
        enableTimePointing: ['SSML_MARK']
    };
    if (ssml) {
        requestBody.input.ssml = text;
    }
    else {
        requestBody.input.text = text;
    }
    const response = await request({
        method: 'POST',
        url: `https://texttospeech.googleapis.com/v1beta1/text:synthesize`,
        params: {
            'key': apiKey
        },
        headers: {
            'User-Agent': ''
        },
        data: requestBody,
        responseType: 'json'
    });
    logger.start('Parse result');
    const result = parseResponseBody(response.data);
    logger.end();
    return result;
}
function parseResponseBody(responseBody) {
    const audioData = decodeBase64(responseBody.audioContent);
    const timepoints = responseBody.timepoints;
    return { audioData, timepoints };
}
// Voices with audio samples: https://cloud.google.com/text-to-speech/docs/voices
export async function getVoiceList(apiKey) {
    const requestURL = `https://texttospeech.googleapis.com/v1beta1/voices`;
    const response = await request({
        method: 'GET',
        url: requestURL,
        params: {
            'key': apiKey
        },
        headers: {
            'User-Agent': ''
        },
        responseType: 'json'
    });
    const responseData = response.data;
    const voices = responseData.voices;
    return voices;
}
//# sourceMappingURL=GoogleCloudTTS.js.map