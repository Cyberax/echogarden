import { extendDeep } from '../utilities/ObjectUtilities.js';
import { concatFloat32Arrays } from '../utilities/Utilities.js';
import { WasmMemoryManager } from '../utilities/WasmMemoryManager.js';
let rubberbandInstance;
export async function stretchTimePitch(rawAudio, speed, pitchScale, options) {
    options = extendDeep(defaultRubberbandOptions, options);
    const channels = rawAudio.audioChannels;
    const channelCount = channels.length;
    const sampleCount = channels[0].length;
    const sampleRate = rawAudio.sampleRate;
    const m = await getRubberbandInstance();
    const wasmMemory = new WasmMemoryManager(m);
    const optionFlags = rubberBandOptionsToFlags(options);
    const statePtr = m._rubberband_new(sampleRate, channelCount, optionFlags, 1, 1);
    m._rubberband_set_time_ratio(statePtr, 1 / speed);
    m._rubberband_set_pitch_scale(statePtr, pitchScale);
    const samplesRequired = m._rubberband_get_samples_required(statePtr);
    const bufferSize = Math.min(samplesRequired, sampleCount);
    const bufferChannelPtrsRef = wasmMemory.allocUint32Array(bufferSize);
    const bufferChannelRefs = [];
    for (let i = 0; i < channelCount; i++) {
        const bufferChannelRef = wasmMemory.allocFloat32Array(bufferSize);
        bufferChannelPtrsRef.view[i] = bufferChannelRef.address;
        bufferChannelRefs.push(bufferChannelRef);
    }
    m._rubberband_set_expected_input_duration(statePtr, sampleCount);
    //m._rubberband_set_max_process_size(statePtr, bufferSize)
    for (let offset = 0; offset < sampleCount; offset += bufferSize) {
        let writtenSize;
        let isFinal;
        if (sampleCount - offset > bufferSize) {
            writtenSize = bufferSize;
            isFinal = 0;
        }
        else {
            writtenSize = sampleCount - offset;
            isFinal = 1;
        }
        for (let i = 0; i < channelCount; i++) {
            const samplesToWrite = channels[i].subarray(offset, offset + writtenSize);
            bufferChannelRefs[i].view.set(samplesToWrite);
        }
        m._rubberband_study(statePtr, bufferChannelPtrsRef.address, writtenSize, isFinal);
    }
    const outputAudioChannelChunks = [];
    for (let i = 0; i < channelCount; i++) {
        outputAudioChannelChunks.push([]);
    }
    for (let readOffset = 0; readOffset < sampleCount; readOffset += bufferSize) {
        let writtenSize;
        let isFinal;
        if (sampleCount - readOffset > bufferSize) {
            writtenSize = bufferSize;
            isFinal = 0;
        }
        else {
            writtenSize = sampleCount - readOffset;
            isFinal = 1;
        }
        for (let i = 0; i < channelCount; i++) {
            const samplesToWrite = channels[i].subarray(readOffset, readOffset + writtenSize);
            bufferChannelRefs[i].view.set(samplesToWrite);
        }
        m._rubberband_process(statePtr, bufferChannelPtrsRef.address, writtenSize, isFinal);
        while (true) {
            const samplesAvailable = m._rubberband_available(statePtr);
            if (samplesAvailable <= 0) {
                break;
            }
            const sizeToRead = Math.min(samplesAvailable, bufferSize);
            const readCount = m._rubberband_retrieve(statePtr, bufferChannelPtrsRef.address, sizeToRead);
            for (let i = 0; i < channelCount; i++) {
                const readSamplesForChannel = bufferChannelRefs[i].view.slice(0, readCount);
                outputAudioChannelChunks[i].push(readSamplesForChannel);
            }
        }
    }
    m._rubberband_delete(statePtr);
    wasmMemory.freeAll();
    const outputAudioChannels = outputAudioChannelChunks.map(chunks => concatFloat32Arrays(chunks));
    const outputRawAudio = { audioChannels: outputAudioChannels, sampleRate };
    return outputRawAudio;
}
export async function getRubberbandInstance() {
    if (!rubberbandInstance) {
        const { default: RubberbandInitializer } = await import('@echogarden/rubberband-wasm');
        rubberbandInstance = await RubberbandInitializer();
    }
    return rubberbandInstance;
}
export function rubberBandOptionsToFlags(options) {
    let flags = 0;
    if (options.stretch == 'precise') {
        flags += RubberBandOptionFlag.StretchPrecise;
    }
    if (options.transients == 'mixed') {
        flags += RubberBandOptionFlag.TransientsMixed;
    }
    else if (options.transients == 'smooth') {
        flags += RubberBandOptionFlag.TransientsSmooth;
    }
    if (options.detector == 'percussive') {
        flags += RubberBandOptionFlag.DetectorPercussive;
    }
    else if (options.detector == 'soft') {
        flags += RubberBandOptionFlag.DetectorSoft;
    }
    if (options.phase == 'independent') {
        flags += RubberBandOptionFlag.PhaseIndependent;
    }
    if (options.window == 'short') {
        flags += RubberBandOptionFlag.WindowShort;
    }
    else if (options.window == 'long') {
        flags += RubberBandOptionFlag.WindowLong;
    }
    if (options.smoothing == 'on') {
        flags += RubberBandOptionFlag.SmoothingOn;
    }
    if (options.formant == 'preserved') {
        flags += RubberBandOptionFlag.FormantPreserved;
    }
    if (options.pitch == 'high-quality') {
        flags += RubberBandOptionFlag.PitchHighQuality;
    }
    else if (options.pitch == 'high-consistency') {
        flags += RubberBandOptionFlag.PitchHighConsistency;
    }
    if (options.channels == 'together') {
        flags += RubberBandOptionFlag.ChannelsTogether;
    }
    if (options.engine == 'finer') {
        flags += RubberBandOptionFlag.EngineFiner;
    }
    return flags;
}
export var RubberBandOptionFlag;
(function (RubberBandOptionFlag) {
    RubberBandOptionFlag[RubberBandOptionFlag["ProcessOffline"] = 0] = "ProcessOffline";
    RubberBandOptionFlag[RubberBandOptionFlag["ProcessRealTime"] = 1] = "ProcessRealTime";
    RubberBandOptionFlag[RubberBandOptionFlag["StretchElastic"] = 0] = "StretchElastic";
    RubberBandOptionFlag[RubberBandOptionFlag["StretchPrecise"] = 16] = "StretchPrecise";
    RubberBandOptionFlag[RubberBandOptionFlag["TransientsCrisp"] = 0] = "TransientsCrisp";
    RubberBandOptionFlag[RubberBandOptionFlag["TransientsMixed"] = 256] = "TransientsMixed";
    RubberBandOptionFlag[RubberBandOptionFlag["TransientsSmooth"] = 512] = "TransientsSmooth";
    RubberBandOptionFlag[RubberBandOptionFlag["DetectorCompound"] = 0] = "DetectorCompound";
    RubberBandOptionFlag[RubberBandOptionFlag["DetectorPercussive"] = 1024] = "DetectorPercussive";
    RubberBandOptionFlag[RubberBandOptionFlag["DetectorSoft"] = 2048] = "DetectorSoft";
    RubberBandOptionFlag[RubberBandOptionFlag["PhaseLaminar"] = 0] = "PhaseLaminar";
    RubberBandOptionFlag[RubberBandOptionFlag["PhaseIndependent"] = 8192] = "PhaseIndependent";
    RubberBandOptionFlag[RubberBandOptionFlag["ThreadingAuto"] = 0] = "ThreadingAuto";
    RubberBandOptionFlag[RubberBandOptionFlag["ThreadingNever"] = 65536] = "ThreadingNever";
    RubberBandOptionFlag[RubberBandOptionFlag["ThreadingAlways"] = 131072] = "ThreadingAlways";
    RubberBandOptionFlag[RubberBandOptionFlag["WindowStandard"] = 0] = "WindowStandard";
    RubberBandOptionFlag[RubberBandOptionFlag["WindowShort"] = 1048576] = "WindowShort";
    RubberBandOptionFlag[RubberBandOptionFlag["WindowLong"] = 2097152] = "WindowLong";
    RubberBandOptionFlag[RubberBandOptionFlag["SmoothingOff"] = 0] = "SmoothingOff";
    RubberBandOptionFlag[RubberBandOptionFlag["SmoothingOn"] = 8388608] = "SmoothingOn";
    RubberBandOptionFlag[RubberBandOptionFlag["FormantShifted"] = 0] = "FormantShifted";
    RubberBandOptionFlag[RubberBandOptionFlag["FormantPreserved"] = 16777216] = "FormantPreserved";
    RubberBandOptionFlag[RubberBandOptionFlag["PitchHighSpeed"] = 0] = "PitchHighSpeed";
    RubberBandOptionFlag[RubberBandOptionFlag["PitchHighQuality"] = 33554432] = "PitchHighQuality";
    RubberBandOptionFlag[RubberBandOptionFlag["PitchHighConsistency"] = 67108864] = "PitchHighConsistency";
    RubberBandOptionFlag[RubberBandOptionFlag["ChannelsApart"] = 0] = "ChannelsApart";
    RubberBandOptionFlag[RubberBandOptionFlag["ChannelsTogether"] = 268435456] = "ChannelsTogether";
    RubberBandOptionFlag[RubberBandOptionFlag["EngineFaster"] = 0] = "EngineFaster";
    RubberBandOptionFlag[RubberBandOptionFlag["EngineFiner"] = 536870912] = "EngineFiner";
})(RubberBandOptionFlag || (RubberBandOptionFlag = {}));
export var RubberBandPresetOption;
(function (RubberBandPresetOption) {
    RubberBandPresetOption[RubberBandPresetOption["DefaultOptions"] = 0] = "DefaultOptions";
    RubberBandPresetOption[RubberBandPresetOption["PercussiveOptions"] = 1056768] = "PercussiveOptions";
})(RubberBandPresetOption || (RubberBandPresetOption = {}));
export const defaultRubberbandOptions = {
    stretch: 'elastic',
    transients: 'crisp',
    detector: 'compound',
    phase: 'laminar',
    window: 'standard',
    smoothing: 'off',
    formant: 'shited',
    pitch: 'high-speed',
    channels: 'apart',
    engine: 'faster'
};
//# sourceMappingURL=Rubberband.js.map