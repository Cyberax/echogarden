import { concatFloat32Arrays } from '../utilities/Utilities.js';
import { getOnnxSessionOptions } from '../utilities/OnnxUtilities.js';
export async function detectVoiceActivity(rawAudio, modelPath, frameDuration, executionProviders) {
    if (rawAudio.sampleRate != 16000) {
        throw new Error('Audio sample rate must be 16KHz');
    }
    const audioSamples = rawAudio.audioChannels[0];
    const frameLength = Math.floor(16000 * (frameDuration / 1000));
    const sileroVad = new SileroVAD(modelPath, executionProviders);
    const frameProbabilities = [];
    for (let position = 0; position < audioSamples.length; position += frameLength) {
        let chunk = audioSamples.subarray(position, position + frameLength);
        if (chunk.length < frameLength) {
            chunk = concatFloat32Arrays([chunk, new Float32Array(frameLength - chunk.length)]);
        }
        const probability = await sileroVad.predictAudioFrame(chunk);
        frameProbabilities.push(probability);
    }
    return frameProbabilities;
}
export class SileroVAD {
    modelPath;
    executionProviders;
    session;
    modelStateH;
    modelStateC;
    modelSampleRate;
    constructor(modelPath, executionProviders) {
        this.modelPath = modelPath;
        this.executionProviders = executionProviders;
    }
    async predictAudioFrame(frame) {
        await this.initializeIfNeeded();
        const Onnx = await import('onnxruntime-node');
        const inputTensor = new Onnx.Tensor('float32', frame, [1, frame.length]);
        const inputs = { input: inputTensor, sr: this.modelSampleRate, h: this.modelStateH, c: this.modelStateC };
        const results = await this.session.run(inputs);
        const probability = results['output'].data[0];
        this.modelStateH = results['hn'];
        this.modelStateC = results['cn'];
        return probability;
    }
    async initializeIfNeeded() {
        if (this.session) {
            return;
        }
        const Onnx = await import('onnxruntime-node');
        const h = new Float32Array(2 * 1 * 64);
        const c = new Float32Array(2 * 1 * 64);
        this.modelStateH = new Onnx.Tensor('float32', h, [2, 1, 64]);
        this.modelStateC = new Onnx.Tensor('float32', c, [2, 1, 64]);
        this.modelSampleRate = new Onnx.Tensor('int64', new BigInt64Array([BigInt(16000)]), []);
        const onnxSessionOptions = getOnnxSessionOptions({ executionProviders: this.executionProviders });
        this.session = await Onnx.InferenceSession.create(this.modelPath, onnxSessionOptions);
    }
}
//# sourceMappingURL=SileroVAD.js.map