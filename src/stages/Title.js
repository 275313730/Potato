import { Game } from "../../modules/Game/Game.js";
import { Sprite } from "../../modules/Sprite/Sprite.js";

import { titleFrame } from "../sprites/TitleFrame.js";
import { backGround } from "../sprites/BackGround.js";

export function title() {
    const bgs = ['sky', 'mounFar', 'mounNear', 'treeFar', 'treeNear']

    return {
        created() {
            // 载入背景
            bgs.forEach(bg => {
                new Sprite(backGround(bg))
            })

            // 添加精灵
            new Sprite(titleFrame())

            // 播放音频
            Game.music.play('forest')
        }
    }
}