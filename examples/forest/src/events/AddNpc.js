import { Game, Sprite } from "../../core/Potato.js";
import { npc } from "../sprites/Npc.js";

export function addNpc(player) {
    if (Game.key === 'Escape') {
        // 删除当前事件
        this.event.del('addNpc')

        // hatman数据
        const hatman = {
            id: 'hatman',
            x: 420,
            top: -5,
            textArr: [`hatman: "Wow, you created me.It's amazing."`],
        }

        // 添加hatman
        let newHatMan = new Sprite(npc(hatman.id, hatman.x, hatman.top, hatman.textArr))

        // 移动镜头
        this.camera.moveTo(newHatMan, 2, () => {
            this.camera.moveTo(player, 2, () => {
                this.camera.follow(player)
            })
        })
    }
}