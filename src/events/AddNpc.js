import { Game } from "../../modules/Game/Game.js";
import { npc } from "../sprites/Npc.js";
import { Sprite } from "../../modules/Sprite/Sprite.js";

export function addNpc(player) {
    if (Game.key === 'Escape') {
        // 删除当前事件
        this.event.del('addNpc')

        // hatman数据
        const hatman = {
            id: 'hatman',
            x: 420,
            textArr: [`hatman: "Wow, you created me.You can walk forward to the next map."`],
        }

        // 添加hatman
        let newHatMan = new Sprite(npc(hatman.id, hatman.x, hatman.textArr))

        // 移动镜头
        this.camera.moveTo(newHatMan, 2, () => {
            this.camera.moveTo(player, 2, () => {
                this.camera.follow(player)
            })
        })
    }
}