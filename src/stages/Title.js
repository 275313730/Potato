import { Game } from "../../modules/Game.js";
import { Stage } from "../../modules/Stage.js";

import { titleFrame } from "../sprites/TitleFrame.js";
import { backGround } from "../sprites/BackGround.js";

export function title() {
    const bgs = ['sky', 'mounFar', 'mounNear', 'treeFar', 'treeNear']

    return new Stage({ id: 'title' }, function () {
        // 载入背景
        bgs.forEach(bg => {
            this.sprite.add(backGround(bg))
        })

        this.sprite.add(titleFrame())

        Game.music.play('forest')
        Game.music.loop(true)
    })
}