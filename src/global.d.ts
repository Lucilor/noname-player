import cPlayer, {ICplayerOption} from "cplayer";
import _fs from "fs";

declare global {
    interface Window {
        game: Game;
        cPlayer: cPlayer;
        fs: typeof _fs;
        resolveLocalFileSystemURL?: (url: string, success: (fileSystem: any) => void, error: (error: any) => void) => void;
    }

    interface Game {
        [key: string]: any;
        log(...args: any[]): void;
        getConfig(key: string): any;
        saveConfig: (key: string, value: any) => void;
        getExtensionConfig(name: string, key: string): any;
        saveExtensionConfig: (name: string, key: string, value: any) => void;
    }

    interface HTMLElement {
        link: string | number;
    }

    interface Playlist {
        id: string;
        name: string;
        mode: "listloop" | "singlecycle" | "listrandom";
        content: ICplayerOption["playlist"];
    }
}
