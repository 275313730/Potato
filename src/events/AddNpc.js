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

        let newHatMan = npc(hatman.id, hatman.x, hatman.textArr)

        // 添加hatman
        this.sprite.add(newHatMan)

        // 移动镜头
        this.camera.moveTo(newHatMan, 1500, () => {
            const player = this.sprite.find('player')
            this.camera.moveTo(player, 1500, () => {
                this.camera.follow(player)
            })
        })
    }
}