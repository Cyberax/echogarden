import { SynthesisVoice } from '../api/API.js';
import { RawAudio } from '../audio/AudioUtilities.js';
export declare function synthesize(text: string, textAnalysisFilePath: string, signalGenerationFilePath: string, postprocessOutput?: boolean): Promise<{
    rawAudio: RawAudio;
}>;
export declare function getInstance(): Promise<any>;
export declare function getResourceFilenamesForLanguage(language: string): {
    textAnalysisFilename: string;
    signalGenerationFilename: string;
};
export declare const voiceList: SynthesisVoice[];
