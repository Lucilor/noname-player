import cplayer from "cplayer";
import Draggable from "draggable";
import {openChangelog} from "./changelog/changelog";
import {extensionName, extensionVersion} from "./const";
import "./cplayer.scss";
import introHtml from "./intro/intro.html";
import "./intro/intro.scss";
import "./polyfill";
import "./styles.scss";
import {CPlayerUtils, getOpacityOptions, getPlaylist, replaceHtml} from "./utils";

declare const game: Game;
// eslint-disable-next-line @typescript-eslint/no-shadow
game.import("extension", (lib: any, game: Game, ui: any, get: any, ai: any, _status: any) => ({
    name: extensionName,
    content: async (config: any, pack: any) => {
        window.game = game;
        const loadCPlayer = async (id: string) => {
            if (!id) {
                return;
            }
            try {
                const playlist = await getPlaylist(id);
                if (!playlist) {
                    alert(`${extensionName}无法获取网易云歌单：${id}`);
                    return;
                }
                ui.backgroundMusic.src = "";

                let volume = game.getExtensionConfig(extensionName, "volume");
                if (typeof volume !== "number") {
                    volume = lib.config.volumn_background / 8.0;
                    game.saveExtensionConfig(extensionName, "volume", volume);
                }
                let position = game.getExtensionConfig(extensionName, "position");
                if (!position) {
                    position = {x: 0.1, y: 0.1};
                    game.saveExtensionConfig(extensionName, "position", position);
                }
                const host = document.createElement("div");
                host.classList.add("c-player");
                host.style.left = position.x * innerWidth + "px";
                host.style.top = position.y * innerHeight + "px";
                document.body.appendChild(host);
                const cPlayer = new cplayer({
                    element: host,
                    volume,
                    // autoplay: true,
                    playlist,
                    big: game.getExtensionConfig(extensionName, "size") === "big",
                    dark: game.getExtensionConfig(extensionName, "color") === "dark",
                    shadowDom: false
                    // size: "20px"
                });
                cPlayer.mode = game.getExtensionConfig(extensionName, "mode");
                window.cPlayer = cPlayer;
                const root = cPlayer.view.getRootElement() as HTMLDivElement;
                CPlayerUtils.setBackgroundOpacity();
                new Draggable(host, {
                    handle: root.querySelector(".cp-poster"),
                    onDrag: (e: HTMLElement, x: number, y: number) => {
                        x = x / innerWidth;
                        y = y / innerHeight;
                        game.saveExtensionConfig(extensionName, "position", {x, y});
                    }
                });
                cPlayer.on("volumechange", (value) => {
                    game.saveExtensionConfig(extensionName, "volume", value);
                });

                const i = setInterval(() => {
                    if (cPlayer) {
                        cPlayer.play();
                        clearInterval(i);
                    }
                }, 500);
            } catch (e) {
                window.game.saveExtensionConfig(extensionName, "playlist", null);
                alert(e);
            }
        };

        const id = game.getExtensionConfig(extensionName, "playlistId");
        if (ui.arena) {
            loadCPlayer(id);
        } else {
            lib.arenaReady.push(() => {
                loadCPlayer(id);
            });
        }
        game.音乐播放器_setPlaylistId = (value: string) => {
            game.saveExtensionConfig(extensionName, "playlistId", value);
        };
        game.音乐播放器_setBackgroundOpacity = CPlayerUtils.setBackgroundOpacity.bind(CPlayerUtils);
        game.音乐播放器_openChangelog = openChangelog;
    },
    help: {},
    config: {
        playlist: {
            name: `歌单<span style='color:red;margin-right:20px'>*</span><input id="音乐播放器_playlistIdInput" value="${
                game.getExtensionConfig(extensionName, "playlistId") || ""
            }" oninput="game.音乐播放器_setPlaylistId(this.value)" />`,
            clear: true
        },
        size: {
            name: "大小",
            item: {
                big: "大",
                small: "小"
            },
            init: "small",
            onclick: (item: string) => {
                game.saveExtensionConfig(extensionName, "size", item);
                CPlayerUtils.setBig(item === "big");
            }
        },
        color: {
            name: "颜色",
            item: {
                light: "浅色",
                dark: "深色"
            },
            init: "light",
            onclick: (item: string) => {
                game.saveExtensionConfig(extensionName, "color", item);
                CPlayerUtils.setDark(item === "dark");
            }
        },
        backgroundOpacity: {
            name: "背景透明度",
            intro: "重启后生效",
            item: getOpacityOptions(),
            init: "1.0",
            onclick: (value: string) => {
                game.saveExtensionConfig(extensionName, "backgroundOpacity", value);
                game.音乐播放器_setBackgroundOpacity();
            }
        },
        mode: {
            name: "播放模式",
            item: {
                listloop: "列表循环",
                singlecycle: "单曲循环",
                listrandom: "列表随机"
            },
            init: "listloop",
            onclick: (item: string) => {
                game.cPlayer.mode = item;
                game.saveExtensionConfig(extensionName, "mode", item);
            }
        },
        resetPosition: {
            name: "重置播放器位置",
            clear: true,
            onclick: () => {
                const el = CPlayerUtils.getHost();
                el.style.left = "0";
                el.style.top = "0";
                game.saveExtensionConfig(extensionName, "position", {x: 0, y: 0});
            }
        },
        removeCache: {
            name: "删除歌单缓存",
            clear: true,
            onclick: () => {
                game.saveExtensionConfig(extensionName, "playlist", null);
                alert("缓存已删除");
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
        diskURL: "",
        forumURL: "",
        version: extensionVersion
    },
    files: {character: [], card: [], skill: []}
}));
