import {ICplayerOption} from "cplayer";

export const getOpacityOptions = () => ({
    "0.0": "0.0",
    "0.1": "0.1",
    "0.2": "0.2",
    "0.3": "0.3",
    "0.4": "0.4",
    "0.5": "0.5",
    "0.6": "0.6",
    "0.7": "0.7",
    "0.8": "0.8",
    "0.9": "0.9",
    "1.0": "1.0"
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

export class CPlayerUtils {
    static isDragging = false;

    static getRoot() {
        return window.cPlayer.view.getRootElement() as HTMLElement;
    }

    static getHost() {
        const parent = this.getRoot().parentElement;
        return parent as HTMLElement;
    }

    static setBackgroundOpacity(opacity: string) {
        const root = this.getRoot();
        const mainBody = root.querySelector<HTMLDivElement>(".cp-mainbody");
        const poster = root.querySelector<HTMLDivElement>(".cp-poster");
        if (mainBody) {
            if (root.classList.contains("cp-dark")) {
                mainBody.style.backgroundColor = `rgba(0,0,0,${opacity})`;
            } else {
                mainBody.style.backgroundColor = `rgba(255,255,255,${opacity})`;
            }
        }
        if (poster) {
            poster.style.opacity = opacity;
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
    }

    static setPlaylist(playlist: Playlist) {
        const player = window.cPlayer;
        player.playlist.slice().forEach((item) => player.remove(item));
        playlist.forEach((item) => player.add(item));
    }

    static show() {
        const root = this.getRoot();
        root.style.display = "block";
    }

    static hide() {
        const root = this.getRoot();
        root.style.display = "none";
    }
}
