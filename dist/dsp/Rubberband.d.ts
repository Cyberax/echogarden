import { RawAudio } from '../audio/AudioUtilities.js';
export declare function stretchTimePitch(rawAudio: RawAudio, speed: number, pitchScale: number, options: RubberbandOptions): Promise<RawAudio>;
export declare function getRubberbandInstance(): Promise<any>;
export declare function rubberBandOptionsToFlags(options: RubberbandOptions): number;
export declare enum RubberBandOptionFlag {
    ProcessOffline = 0,
    ProcessRealTime = 1,
    StretchElastic = 0,
    StretchPrecise = 16,
    TransientsCrisp = 0,
    TransientsMixed = 256,
    TransientsSmooth = 512,
    DetectorCompound = 0,
    DetectorPercussive = 1024,
    DetectorSoft = 2048,
    PhaseLaminar = 0,
    PhaseIndependent = 8192,
    ThreadingAuto = 0,
    ThreadingNever = 65536,
    ThreadingAlways = 131072,
    WindowStandard = 0,
    WindowShort = 1048576,
    WindowLong = 2097152,
    SmoothingOff = 0,
    SmoothingOn = 8388608,
    FormantShifted = 0,
    FormantPreserved = 16777216,
    PitchHighSpeed = 0,
    PitchHighQuality = 33554432,
    PitchHighConsistency = 67108864,
    ChannelsApart = 0,
    ChannelsTogether = 268435456,
    EngineFaster = 0,
    EngineFiner = 536870912
}
export declare enum RubberBandPresetOption {
    DefaultOptions = 0,
    PercussiveOptions = 1056768
}
export declare const defaultRubberbandOptions: RubberbandOptions;
export type RubberbandOptions = {
    stretch?: 'elastic' | 'precise';
    transients?: 'crisp' | 'mixed' | 'smooth';
    detector?: 'compound' | 'percussive' | 'soft';
    phase?: 'laminar' | 'independent';
    window?: 'standard' | 'long' | 'short';
    smoothing?: 'off' | 'on';
    formant?: 'shited' | 'preserved';
    pitch?: 'high-speed' | 'high-quality' | 'high-consistency';
    channels?: 'apart' | 'together';
    engine?: 'faster' | 'finer';
};
