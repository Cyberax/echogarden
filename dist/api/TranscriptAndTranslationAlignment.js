import { extendDeep } from '../utilities/ObjectUtilities.js';
import { logToStderr } from '../utilities/Utilities.js';
import { Logger } from '../utilities/Logger.js';
import * as API from './API.js';
import chalk from 'chalk';
const log = logToStderr;
export async function alignTranscriptAndTranslation(input, transcript, translatedTranscript, options) {
    const logger = new Logger();
    const startTimestamp = logger.getTimestamp();
    options = extendDeep(defaultTranscriptAndTranslationAlignmentOptions, options);
    if (options.sourceLanguage && !options.alignment?.language) {
        options.alignment = extendDeep(options.alignment || {}, { language: options.sourceLanguage });
    }
    if (options.targetLanguage && !options.timelineAlignment?.targetLanguage) {
        options.timelineAlignment = extendDeep(options.timelineAlignment || {}, { targetLanguage: options.targetLanguage });
    }
    let alignmentResult;
    let timelineAlignmentResult;
    switch (options.engine) {
        case 'two-stage': {
            logger.logTitledMessage(`Start stage 1`, `Align speech to transcript`, chalk.magentaBright);
            logger.end();
            alignmentResult = await API.align(input, transcript, options.alignment || {});
            logger.log(``);
            logger.logTitledMessage(`Start stage 2`, `Align timeline to translated transcript`, chalk.magentaBright);
            logger.end();
            timelineAlignmentResult = await API.alignTimelineTranslation(alignmentResult.timeline, translatedTranscript, options.timelineAlignment || {});
            break;
        }
        default: {
            throw new Error(`Engine '${options.engine}' is not supported`);
        }
    }
    logger.end();
    logger.log(``);
    logger.logDuration(`Total transcript and translation alignment time`, startTimestamp, chalk.magentaBright);
    return {
        timeline: alignmentResult.timeline,
        wordTimeline: alignmentResult.wordTimeline,
        translatedTimeline: timelineAlignmentResult.timeline,
        translatedWordTimeline: timelineAlignmentResult.wordTimeline,
        transcript,
        translatedTranscript,
        sourceLanguage: alignmentResult.language,
        targetLanguage: timelineAlignmentResult.targetLanguage,
        inputRawAudio: alignmentResult.inputRawAudio,
        isolatedRawAudio: alignmentResult.isolatedRawAudio,
        backgroundRawAudio: alignmentResult.backgroundRawAudio,
    };
}
export const defaultTranscriptAndTranslationAlignmentOptions = {
    engine: 'two-stage',
    sourceLanguage: undefined,
    targetLanguage: undefined,
    isolate: false,
    crop: true,
    alignment: {},
    timelineAlignment: {},
    languageDetection: {},
    plainText: {
        paragraphBreaks: 'double',
        whitespace: 'collapse'
    },
    subtitles: {},
    vad: {
        engine: 'adaptive-gate'
    },
    sourceSeparation: {},
};
export const TranscriptAndTranslationAlignmentEngines = [
    {
        id: 'two-stage',
        name: 'Two-stage translation alignment',
        description: 'Applies two-stage translation alignment to the spoken audio. First stage aligns the speech to the native language transcript. Second stage aligns the resulting timeline with the translated transcript.',
        type: 'local'
    }
];
//# sourceMappingURL=TranscriptAndTranslationAlignment.js.map