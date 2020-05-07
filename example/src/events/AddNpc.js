import { Game } from "../../modules/Game.js";
import { npc } from "../sprites/Npc.js";

export function addNpc() {
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
        let newHatMan = this.sprite.add(npc(hatman.id, hatman.x, hatman.textArr))

        // 移动镜头
        this.camera.moveTo(newHatMan, 2, () => {
            const player = this.sprite.find('player')
            this.camera.moveTo(player, 2, () => {
                this.camera.follow(player)
            })
        })
    }
}