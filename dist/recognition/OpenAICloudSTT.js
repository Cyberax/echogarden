import * as FFMpegTranscoder from '../codecs/FFMpegTranscoder.js';
import { createVirtualFileReadStreamForBuffer } from '../utilities/VirtualFileReadStream.js';
import { Logger } from '../utilities/Logger.js';
import { extendDeep } from '../utilities/ObjectUtilities.js';
import { alignSegments } from '../api/Alignment.js';
export async function recognize(rawAudio, languageCode, options, task = 'transcribe') {
    const logger = new Logger();
    logger.start('Load OpenAI module');
    options = extendDeep(defaultOpenAICloudSTTOptions, options);
    if (options.requestWordTimestamps === undefined) {
        options.requestWordTimestamps = options.baseURL === undefined;
    }
    if (options.model === undefined) {
        if (options.baseURL === undefined) {
            options.model = 'whisper-1';
        }
        else {
            throw new Error(`A custom provider for the OpenAI Cloud API requires specifying a model name`);
        }
    }
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI(options);
    logger.start('Encode audio to send');
    const ffmpegOptions = FFMpegTranscoder.getDefaultFFMpegOptionsForSpeech('mp3');
    const encodedAudio = await FFMpegTranscoder.encodeFromChannels(rawAudio, ffmpegOptions);
    const virtualFileStream = createVirtualFileReadStreamForBuffer(encodedAudio, 'audio.mp3');
    logger.start(options.baseURL ? `Send request to ${options.baseURL}` : 'Send request to OpenAI Cloud API');
    let response;
    if (task == 'transcribe') {
        const timestamp_granularities = options.requestWordTimestamps ? ['word', 'segment'] : undefined;
        response = await openai.audio.transcriptions.create({
            file: virtualFileStream,
            model: options.model,
            language: languageCode,
            prompt: options.prompt,
            response_format: 'verbose_json',
            temperature: options.temperature,
            timestamp_granularities,
        });
    }
    else if (task == 'translate') {
        response = await openai.audio.translations.create({
            file: virtualFileStream,
            model: options.model,
            prompt: options.prompt,
            response_format: 'verbose_json',
            temperature: options.temperature,
        });
    }
    else {
        throw new Error(`Invalid task`);
    }
    const transcript = response.text.trim();
    let timeline;
    if (response.words) {
        timeline = response.words.map(entry => ({
            type: 'word',
            text: entry.word,
            startTime: entry.start,
            endTime: entry.end
        }));
    }
    else {
        const segmentTimeline = response.segments.map(entry => ({
            type: 'segment',
            text: entry.text,
            startTime: entry.start,
            endTime: entry.end
        }));
        if (task === 'transcribe') {
            logger.start('Align segments');
            timeline = await alignSegments(rawAudio, segmentTimeline, { language: languageCode });
        }
        else {
            timeline = segmentTimeline;
        }
    }
    logger.end();
    return { transcript, timeline };
}
export const defaultOpenAICloudSTTOptions = {
    apiKey: undefined,
    organization: undefined,
    baseURL: undefined,
    model: undefined,
    temperature: 0,
    prompt: undefined,
    timeout: undefined,
    maxRetries: 10,
    requestWordTimestamps: undefined,
};
//# sourceMappingURL=OpenAICloudSTT.js.map