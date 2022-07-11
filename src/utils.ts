import {ICplayerOption} from "cplayer";
import {extensionName} from "./const";

export const getOpacityOptions = () => ({
    "0.0": "0",
    "0.1": "0.1",
    "0.2": "0.2",
    "0.3": "0.3",
    "0.4": "0.4",
    "0.5": "0.5",
    "0.6": "0.6",
    "0.7": "0.7",
    "0.8": "0.8",
    "0.9": "0.9",
    "1.0": "1"
});

export const replaceHtml = (html: string, data: Record<string, string>) => {
    for (const key in data) {
        html = html.replace(new RegExp(`{{[ ]*${key}[ ]*}}`, "g"), data[key]);
    }
    return html;
};

export const parseHtml = <T>(html: string) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild as T | null;
};

export type Playlist = NonNullable<ICplayerOption["playlist"]>;

export const getPlaylist = async (id: string): Promise<Playlist | null> => {
    try {
        const cache = await window.game.getExtensionConfig(extensionName, "playlist");
        try {
            const cacheData = JSON.parse(cache);
            if (cacheData.id === id) {
                return cacheData.data;
            }
        } catch (error) {}
        const res = await fetch(`https://candypurity.com/api/playlist/${id}`);
        const data = await res.json();
        if (data.code === 0) {
            window.game.saveExtensionConfig(extensionName, "playlist", JSON.stringify({id, data: data.data}));
            return data.data;
        }
    } catch (error) {}
    return null;
};

export class CPlayerUtils {
    static getRoot() {
        return window.cPlayer.view.getRootElement() as HTMLElement;
    }

    static getHost() {
        const parent = this.getRoot().parentElement;
        return parent as HTMLElement;
    }

    static setBackgroundOpacity() {
        const root = this.getRoot();
        const mainBody = root.querySelector<HTMLDivElement>(".cp-mainbody");
        const poster = root.querySelector<HTMLDivElement>(".cp-poster");
        const backgroundOpacity = window.game.getExtensionConfig(extensionName, "backgroundOpacity") || "1";
        if (mainBody) {
            if (root.classList.contains("cp-dark")) {
                mainBody.style.backgroundColor = `rgba(0,0,0,${backgroundOpacity})`;
            } else {
                mainBody.style.backgroundColor = `rgba(255,255,255,${backgroundOpacity})`;
            }
        }
        if (poster) {
            poster.style.opacity = backgroundOpacity;
        }
    }

    static setBig(big?: boolean) {
        const root = this.getRoot();
        if (big) {
            root.classList.add("cp-big");
        } else {
            root.classList.remove("cp-big");
        }
    }

    static setDark(dark?: boolean) {
        const root = this.getRoot();
        if (dark) {
            root.classList.add("cp-dark");
        } else {
            root.classList.remove("cp-dark");
        }
        this.setBackgroundOpacity();
    }

    static setPlaylist(playlist: Playlist) {
        const player = window.cPlayer;
        player.playlist.slice().forEach((item) => player.remove(item));
        playlist.forEach((item) => player.add(item));
    }

    static show() {
        const host = this.getHost();
        host.style.display = "block";
    }

    static hide() {
        const host = this.getHost();
        host.style.display = "none";
    }
}
