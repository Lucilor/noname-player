import cPlayer, {ICplayerOption} from "cplayer";

declare global {
    interface Window {
        game: Game;
        lib: any;
        cPlayer: cPlayer;
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

    type Playlist = NonNullable<ICplayerOption["playlist"]>;
}
