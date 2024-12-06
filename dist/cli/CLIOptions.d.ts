import { type AudioPlayerID } from "../audio/AudioPlayer.js";
export interface CLIOptions {
    play?: boolean;
    player?: AudioPlayerID;
    overwrite?: boolean;
    debug?: boolean;
    config?: string;
}
export declare const CLIOptionsKeys: (keyof CLIOptions)[];
