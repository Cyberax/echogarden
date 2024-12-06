import { ensureRawAudio } from '../audio/AudioUtilities.js';
import { Logger } from '../utilities/Logger.js';
import { extendDeep } from '../utilities/ObjectUtilities.js';
export async function synthesize(text, voice, speed, options) {
    const logger = new Logger();
    logger.start('Request synthesis from OpenAI Cloud API');
    options = extendDeep(defaultOpenAICloudTTSOptions, options);
    if (!options.apiKey) {
        throw new Error(`No API key given`);
    }
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI(options);
    const result = await openai.audio.speech.create({
        input: text,
        model: options.model,
        voice: voice,
        response_format: 'opus',
        speed,
    }, {
        maxRetries: 10
    });
    const resultBuffer = await result.buffer();
    logger.start('Decode returned audio');
    const resultRawAudio = ensureRawAudio(resultBuffer);
    logger.end();
    return resultRawAudio;
}
export const defaultOpenAICloudTTSOptions = {
    apiKey: undefined,
    organization: undefined,
    baseURL: undefined,
    model: 'tts-1',
    timeout: undefined,
    maxRetries: 10,
};
export const supportedLanguages = [
    'en',
    'zh',
    'de',
    'es',
    'ru',
    'ko',
    'fr',
    'ja',
    'pt',
    'tr',
    'pl',
    'ca',
    'nl',
    'ar',
    'sv',
    'it',
    'id',
    'hi',
    'fi',
    'vi',
    'iw',
    'uk',
    'el',
    'ms',
    'cs',
    'ro',
    'da',
    'hu',
    'ta',
    'no',
    'th',
    'ur',
    'hr',
    'bg',
    'lt',
    'la',
    'mi',
    'ml',
    'cy',
    'sk',
    'te',
    'fa',
    'lv',
    'bn',
    'sr',
    'az',
    'sl',
    'kn',
    'et',
    'mk',
    'br',
    'eu',
    'is',
    'hy',
    'ne',
    'mn',
    'bs',
    'kk',
    'sq',
    'sw',
    'gl',
    'mr',
    'pa',
    'si',
    'km',
    'sn',
    'yo',
    'so',
    'af',
    'oc',
    'ka',
    'be',
    'tg',
    'sd',
    'gu',
    'am',
    'yi',
    'lo',
    'uz',
    'fo',
    'ht',
    'ps',
    'tk',
    'nn',
    'mt',
    'sa',
    'lb',
    'my',
    'bo',
    'tl',
    'mg',
    'as',
    'tt',
    'haw',
    'ln',
    'ha',
    'ba',
    'jw',
    'su',
];
export const voiceList = [
    {
        name: 'alloy',
        languages: ['en-US', ...supportedLanguages],
        gender: 'male',
    },
    {
        name: 'echo',
        languages: ['en-US', ...supportedLanguages],
        gender: 'male',
    },
    {
        name: 'fable',
        languages: ['en-GB', ...supportedLanguages],
        gender: 'male',
    },
    {
        name: 'onyx',
        languages: ['en-US', ...supportedLanguages],
        gender: 'male',
    },
    {
        name: 'nova',
        languages: ['en-US', ...supportedLanguages],
        gender: 'female',
    },
    {
        name: 'shimmer',
        languages: ['en-US', ...supportedLanguages],
        gender: 'female',
    },
];
//# sourceMappingURL=OpenAICloudTTS.js.map