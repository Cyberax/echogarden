import { request } from 'gaxios';
import * as FFMpegTranscoder from '../codecs/FFMpegTranscoder.js';
import { Logger } from '../utilities/Logger.js';
import { encodeBase64 } from '../encodings/Base64.js';
export async function recognize(rawAudio, apiKey, languageCode = 'en-US') {
    const flac16Khz16bitMonoAudio = await FFMpegTranscoder.encodeFromChannels(rawAudio, { format: 'flac', sampleRate: 16000, sampleFormat: 's16', channelCount: 1 });
    const logger = new Logger();
    logger.start('Request recognition from Google Cloud');
    const requestBody = {
        config: {
            encoding: 'FLAC',
            sampleRateHertz: 16000,
            audioChannelCount: 1,
            languageCode,
            alternativeLanguageCodes: [],
            maxAlternatives: 1,
            profanityFilter: false,
            enableWordTimeOffsets: true,
            enableWordConfidence: true,
            enableAutomaticPunctuation: true,
            model: 'latest_long',
            useEnhanced: true
        },
        audio: {
            content: encodeBase64(flac16Khz16bitMonoAudio)
        }
    };
    const response = await request({
        method: 'POST',
        url: `https://speech.googleapis.com/v1p1beta1/speech:recognize`,
        params: {
            'key': apiKey
        },
        headers: {
            'User-Agent': ''
        },
        data: requestBody,
        responseType: 'json'
    });
    logger.start('Parse response body');
    const result = parseResponseBody(response.data);
    logger.end();
    return result;
}
function parseResponseBody(responseBody) {
    const results = responseBody.results;
    let transcript = '';
    const timeline = [];
    for (const result of results) {
        if (!result.alternatives || !result.alternatives[0] || !result.alternatives[0].transcript) {
            continue;
        }
        const firstAlternative = result.alternatives[0];
        transcript += firstAlternative.transcript;
        for (const wordEvent of firstAlternative.words) {
            timeline.push({
                type: 'word',
                text: wordEvent.word,
                startTime: parseFloat(wordEvent.startTime.replace('s', '')),
                endTime: parseFloat(wordEvent.endTime.replace('s', '')),
                confidence: wordEvent.confidence
            });
        }
    }
    return { transcript, timeline };
}
//# sourceMappingURL=GoogleCloudSTT.js.map