import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import * as FFMpegTranscoder from '../codecs/FFMpegTranscoder.js';
import { Logger } from '../utilities/Logger.js';
import { getRawAudioDuration } from '../audio/AudioUtilities.js';
import { concatUint8Arrays } from '../utilities/Utilities.js';
import { escapeHtml } from '../encodings/HtmlEscape.js';
export async function synthesize(text, subscriptionKey, serviceRegion, languageCode = 'en-US', voice = 'Microsoft Server Speech Text to Speech Voice (en-US, AvaNeural)', ssmlEnabled = false, ssmlPitchString = '+0Hz', ssmlRateString = '+0%') {
    return new Promise((resolve, reject) => {
        const logger = new Logger();
        logger.start('Request synthesis from Azure Cognitive Services');
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.speechSynthesisLanguage = languageCode;
        speechConfig.speechSynthesisVoiceName = voice;
        speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus;
        const audioOutputStream = SpeechSDK.AudioOutputStream.createPullStream();
        const audioConfig = SpeechSDK.AudioConfig.fromStreamOutput(audioOutputStream);
        const synthesis = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
        const events = [];
        synthesis.wordBoundary = (sender, event) => {
            events.push(event);
        };
        const onResult = async (result) => {
            if (result.errorDetails != null) {
                reject(result.errorDetails);
                return;
            }
            let encodedAudio;
            if (false) {
                const bufferSize = 2 ** 16;
                const buffers = [];
                while (true) {
                    const buffer = new Uint8Array(bufferSize);
                    const amountRead = await audioOutputStream.read(buffer);
                    if (amountRead == 0) {
                        audioOutputStream.close();
                        break;
                    }
                    buffers.push(buffer.subarray(0, amountRead));
                }
                encodedAudio = concatUint8Arrays(buffers);
            }
            else {
                encodedAudio = new Uint8Array(result.audioData);
            }
            logger.end();
            const rawAudio = await FFMpegTranscoder.decodeToChannels(encodedAudio, 24000, 1);
            logger.start('Convert boundary events to a timeline');
            const timeline = boundaryEventsToTimeline(events, getRawAudioDuration(rawAudio));
            logger.end();
            resolve({ rawAudio, timeline: timeline });
        };
        const onError = (error) => {
            reject(error);
        };
        if (!ssmlEnabled && ssmlPitchString != '+0%' || ssmlRateString != '+0Hz') {
            ssmlEnabled = true;
            text = escapeHtml(text);
        }
        if (ssmlEnabled) {
            text =
                `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">` +
                    `<voice name="${voice}">` +
                    `<prosody pitch="${ssmlPitchString}" rate="${ssmlRateString}">` +
                    text +
                    `</prosody>` +
                    `</voice>` +
                    `</speak>`;
            synthesis.speakSsmlAsync(text, onResult, onError);
        }
        else {
            synthesis.speakTextAsync(text, onResult, onError);
        }
    });
}
export async function getVoiceList(subscriptionKey, serviceRegion) {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    const synthesis = new SpeechSDK.SpeechSynthesizer(speechConfig, undefined);
    const result = await synthesis.getVoicesAsync();
    return result.voices;
}
export function boundaryEventsToTimeline(events, totalDuration) {
    const timeline = [];
    for (const event of events) {
        const boundaryType = event.boundaryType != null ? event.boundaryType : event.Type;
        if (boundaryType != 'WordBoundary') {
            continue;
        }
        const text = event.text != null ? event.text : event.Data.text.Text;
        const offset = event.audioOffset != null ? event.audioOffset : event.Data.Offset;
        const duration = event.duration != null ? event.duration : event.Data.Duration;
        const startTime = offset / 10000000;
        const endTime = (offset + duration) / 10000000;
        timeline.push({
            type: 'word',
            text,
            startTime,
            endTime
        });
    }
    return timeline;
}
//# sourceMappingURL=AzureCognitiveServicesTTS.js.map