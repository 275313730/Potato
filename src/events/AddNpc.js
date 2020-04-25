import { npc } from "../sprites/Npc.js";

export function addNpc() {
    const player = this.unit.find('player')
    if (player.isAdd) {
        player.isAdd = false

        // hatman数据
        const hatman = {
            id: 'hatman',
            x: 420,
            textArr: [`hatman: "Wow, you created me.You should try to press 'z' to delete sprite."`],
        }

        // 添加hatman
        this.unit.add(npc(hatman.id, hatman.x, hatman.textArr))

        // 删除当前事件
        this.event.del('addNpc')
    }
}