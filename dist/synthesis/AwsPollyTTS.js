import * as FFMpegTranscoder from '../codecs/FFMpegTranscoder.js';
import { Logger } from '../utilities/Logger.js';
import { readBinaryIncomingMessage } from '../utilities/Utilities.js';
export async function synthesize(text, language, voice, region, accessKeyId, secretAccessKey, engine = 'standard', ssmlEnabled = false, lexiconNames) {
    const logger = new Logger();
    logger.start('Load AWS SDK client module');
    const polly = await import('@aws-sdk/client-polly');
    const pollyClient = new polly.PollyClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
    const params = {
        VoiceId: voice,
        LanguageCode: language,
        Engine: engine,
        Text: text,
        LexiconNames: lexiconNames,
        TextType: ssmlEnabled ? 'ssml' : 'text',
        OutputFormat: 'mp3',
    };
    logger.start('Request synthesis from AWS Polly');
    const command = new polly.SynthesizeSpeechCommand(params);
    const result = await pollyClient.send(command);
    const audioStream = result.AudioStream;
    const audioData = await readBinaryIncomingMessage(audioStream);
    logger.end();
    const rawAudio = await FFMpegTranscoder.decodeToChannels(audioData);
    return { rawAudio };
}
export async function getVoiceList(region, accessKeyId, secretAccessKey) {
    const logger = new Logger();
    logger.start('Load AWS SDK client module');
    const polly = await import('@aws-sdk/client-polly');
    logger.start('Request voice list from AWS Polly');
    const pollyClient = new polly.PollyClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
    const command = new polly.DescribeVoicesCommand({});
    const result = await pollyClient.send(command);
    const voices = result.Voices;
    logger.end();
    return voices;
}
//# sourceMappingURL=AwsPollyTTS.js.map