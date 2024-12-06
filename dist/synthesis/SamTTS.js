import { Logger } from '../utilities/Logger.js';
// SAM (Software Automatic Mouth) speech synthesizer from 1982 (pure JS port)
//
// https://github.com/discordier/sam
//
// https://habr-com.translate.goog/ru/post/500764/?_x_tr_sl=auto&_x_tr_tl=en
export async function synthesize(text, pitch = 64, speed = 72, mouth = 128, throat = 128) {
    const logger = new Logger();
    logger.start('Initialize sam module');
    const { default: SamJs } = await import('sam-js');
    const sam = new SamJs({ pitch, speed, mouth, throat });
    logger.start('Synthesize with sam');
    const samples = sam.buf32(text);
    if (!samples) {
        throw new Error('Sam TTS failed');
    }
    const rawAudio = { audioChannels: [samples], sampleRate: 22050 };
    logger.end();
    return { rawAudio };
}
//# sourceMappingURL=SamTTS.js.map