import { Sprite } from "../../core/Potato.js";

import { titleFrame } from "../sprites/TitleFrame.js";
import { backGround } from "../sprites/BackGround.js";
import { bgMusic } from "../sprites/BgMusic.js";

export function title() {
    const bgs = ['sky', 'mounFar', 'mounNear', 'treeFar', 'treeNear']

    return {
        created() {
            // 载入背景音乐
            new Sprite(bgMusic())

            // 载入背景图片
            bgs.forEach(bg => {
                new Sprite(backGround(bg))
            })

            // 添加精灵
            new Sprite(titleFrame())
        }
    }
}