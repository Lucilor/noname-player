import floatingMenuHtml from "./floating-menu.html";
import "./floating-menu.scss";
import {parseHtml} from "../utils";

export class FloatingMenu {
    el = parseHtml<HTMLDivElement>(floatingMenuHtml);

    constructor() {
        if (this.el) {
            document.body.appendChild(this.el);
        }
    }
}
