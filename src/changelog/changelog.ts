import changelogHtml from "./changelog.html";
import changelogData from "./changelog.json";
import "./changelog.scss";
import {parseHtml} from "../utils";

const duration = 500;

export const openChangelog = () => {
    const el = parseHtml<HTMLElement>(changelogHtml);
    if (!el) {
        return null;
    }
    el.id = "test";
    document.body.appendChild(el);
    el.style.animation = `音乐播放器-fade-in ${duration}ms ease-in-out`;
    const closeBtn = el.querySelector<HTMLElement>(".close-btn");
    if (closeBtn) {
        closeBtn.onclick = () => {
            el.style.opacity = "0";
            el.style.animation = `音乐播放器-fade-out ${duration}ms ease-in-out`;
            setTimeout(() => {
                el.remove();
            }, duration);
        };
    }
    changelogData.forEach(({version, date, desc}) => {
        const itemEl = parseHtml<HTMLElement>(
            `<div class="item"><div class="version"><span class="ver-num">v${version}</span> @ <span class="ver-date">${date}</span></div></div>`
        );
        if (!itemEl) {
            return;
        }
        desc.forEach((str) => {
            const descEl = parseHtml<HTMLElement>(`<div class="desc">&middot; ${str}</div>`);
            if (descEl) {
                itemEl.appendChild(descEl);
            }
        });
        el.appendChild(itemEl);
    });
    document.querySelector("#test");
};
