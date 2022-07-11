import {extensionName} from "./const";
import {CPlayerUtils} from "./utils";

export interface ExtensionConfig {
    playlistId: string;
    isBig: boolean;
    isDark: boolean;
    backgroundOpacity: string;
    playMode: "listloop" | "singlecycle" | "listrandom";
    autoPlay: boolean;
    playerPositon: [number, number];
    volume: number;
    playlistCache: {id: string; data: Playlist} | null;
    playerVisible: boolean;
}

export const getDefaultConfig = (lib: any): ExtensionConfig => ({
    playlistId: "",
    isBig: false,
    isDark: false,
    backgroundOpacity: "1",
    playMode: "listloop",
    autoPlay: true,
    playerPositon: [0, 0],
    volume: lib.config.volumn_background / 8.0,
    playlistCache: null,
    playerVisible: true
});

export const initConfig = (lib: any) => {
    const defaultConfig = getDefaultConfig(lib);
    for (const key in defaultConfig) {
        const value = window.game.getExtensionConfig(extensionName, key);
        if (value === undefined) {
            window.game.saveExtensionConfig(extensionName, key, defaultConfig[key as keyof ExtensionConfig]);
        }
    }
};

export const getConfig = <T extends keyof ExtensionConfig>(key: T): ExtensionConfig[T] =>
    window.game.getExtensionConfig(extensionName, key);

export const saveConfig = async <T extends keyof ExtensionConfig>(key: T, value: ExtensionConfig[T], action = true) => {
    window.game.saveExtensionConfig(extensionName, key, value);
    if (action) {
        const key2 = key as keyof ExtensionConfig;
        const value2 = value as any;
        if (key2 === "isBig") {
            CPlayerUtils.setBig(value2);
        } else if (key2 === "isDark") {
            CPlayerUtils.setDark(value2);
            CPlayerUtils.setBackgroundOpacity(getConfig("backgroundOpacity"));
        } else if (key2 === "backgroundOpacity") {
            CPlayerUtils.setBackgroundOpacity(value2);
        } else if (key2 === "playMode") {
            window.cPlayer.mode = value2;
        } else if (key2 === "playerPositon") {
            const el = CPlayerUtils.getHost();
            el.style.left = `${value2[0]}px`;
            el.style.top = `${value2[1]}px`;
        } else if (key2 === "playerVisible") {
            if (value2) {
                CPlayerUtils.show();
            } else {
                CPlayerUtils.hide();
            }
        } else if (key2 === "playlistId") {
            const playlist = await getPlaylist(value2);
            if (playlist) {
                CPlayerUtils.setPlaylist(value2);
            }
        }
    }
};

export const getPlaylist = async (id: string): Promise<Playlist | null> => {
    try {
        const cache = getConfig("playlistCache");
        try {
            if (cache && cache.id === id) {
                return cache.data;
            }
        } catch (error) {}
        const res = await fetch(`https://candypurity.com/api/playlist/${id}`);
        const data = await res.json();
        if (data.code === 0) {
            saveConfig("playlistCache", {id, data: data.data});
            return data.data;
        }
    } catch (error) {}
    return null;
};
