import cplayer from "cplayer";
import Draggable from "draggable";
import {openChangelog} from "./changelog/changelog";
import {getConfig, getPlaylist, initConfig, saveConfig} from "./config";
import {extensionName, extensionVersion} from "./const";
import "./cplayer.scss";
import introHtml from "./intro/intro.html";
import "./intro/intro.scss";
import "./polyfill";
import "./styles.scss";
import {CPlayerUtils, getOpacityOptions, replaceHtml} from "./utils";

declare const game: Game;
// eslint-disable-next-line @typescript-eslint/no-shadow
game.import("extension", (lib: any, game: Game, ui: any, get: any, ai: any, _status: any) => ({
    name: extensionName,
    content: async (config: any, pack: any) => {
        window.game = game;
        initConfig(lib);
        const loadCPlayer = async () => {
            try {
                const volume = getConfig("volume");
                const position = getConfig("playerPositon");
                const host = document.createElement("div");
                host.classList.add("c-player");
                host.style.left = position[0] * innerWidth + "px";
                host.style.top = position[1] * innerHeight + "px";
                document.body.appendChild(host);
                const cPlayer = new cplayer({
                    element: host,
                    volume: Number(volume),
                    // autoplay: true,
                    playlist: [],
                    big: getConfig("isBig"),
                    dark: getConfig("isDark"),
                    shadowDom: false
                    // size: "20px"
                });
                cPlayer.mode = getConfig("playMode");
                window.cPlayer = cPlayer;
                CPlayerUtils.setBackgroundOpacity(getConfig("backgroundOpacity"));
                const root = CPlayerUtils.getRoot();
                const progress = root.querySelector<HTMLElement>(".cp-progress-container");
                if (progress) {
                    progress.style.left = "0";
                }
                new Draggable(host, {
                    handle: root.querySelector(".cp-poster"),
                    onDrag: (_: HTMLElement, x: number, y: number) => {
                        x = x / innerWidth;
                        y = y / innerHeight;
                        saveConfig("playerPositon", [x, y], false);
                    },
                    onDragStart: () => (CPlayerUtils.isDragging = true),
                    onDragEnd: () => (CPlayerUtils.isDragging = false)
                });
                cPlayer.on("volumechange", (value) => {
                    saveConfig("volume", String(value), false);
                });

                if (getConfig("autoPlay")) {
                    const i = setInterval(() => {
                        if (cPlayer) {
                            cPlayer.play();
                            clearInterval(i);
                        }
                    }, 500);
                }
            } catch (e) {
                saveConfig("playlistCache", null);
                alert(e);
            }
        };

        loadCPlayer();
        game.???????????????_setPlaylistId = (value: string) => {
            saveConfig("playlistId", value);
        };
        game.???????????????_openChangelog = openChangelog;

        const id = getConfig("playlistId");
        const playlist = await getPlaylist(id);
        if (id) {
            if (playlist) {
                CPlayerUtils.setPlaylist(playlist);
            } else {
                alert(`${extensionName}??????????????????????????????${id}`);
            }
        }
    },
    help: {},
    config: {
        playlist: {
            name: `??????<span style='color:red;margin-right:20px'>*</span><input id="???????????????_playlistIdInput" value="${
                getConfig("playlistId") || ""
            }" onchange="window.game.???????????????_setPlaylistId(this.value)" />`,
            clear: true
        },
        volume: {
            name: "??????",
            item: getOpacityOptions(),
            init: "1.0",
            onclick: (item: string) => saveConfig("volume", item)
        },
        isBig: {
            name: "????????????",
            init: false,
            onclick: (item: boolean) => saveConfig("isBig", item)
        },
        isDark: {
            name: "????????????",
            init: false,
            onclick: (item: boolean) => saveConfig("isDark", item)
        },
        backgroundOpacity: {
            name: "???????????????",
            item: getOpacityOptions(),
            init: "1.0",
            onclick: (value: string) => saveConfig("backgroundOpacity", value)
        },
        playMode: {
            name: "????????????",
            item: {
                listloop: "????????????",
                singlecycle: "????????????",
                listrandom: "????????????"
            },
            init: "listloop",
            onclick: (item: any) => saveConfig("playMode", item)
        },
        autoPlay: {
            name: "????????????",
            init: true,
            onclick: (value: boolean) => saveConfig("autoPlay", value)
        },
        resetPosition: {
            name: "?????????????????????",
            clear: true,
            onclick: () => saveConfig("playerPositon", [0, 0])
        },
        removeCache: {
            name: "??????????????????",
            clear: true,
            onclick: () => {
                saveConfig("playlistCache", null);
                alert("???????????????");
            }
        }
    },
    package: {
        character: {
            character: {},
            translate: {}
        },
        card: {
            card: {},
            translate: {},
            list: []
        },
        skill: {
            skill: {},
            translate: {}
        },
        intro: replaceHtml(introHtml, {extensionVersion}),
        author: "Lucilor",
        diskURL: "https://github.com/Lucilor/noname-player/releases/latest",
        forumURL: "https://github.com/Lucilor/noname-player/issues",
        version: extensionVersion
    },
    files: {character: [], card: [], skill: []}
}));
