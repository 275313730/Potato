import { Game } from "../../modules/Game.js";
import { npc } from "../sprites/Npc.js";

export function addNpc() {
    const player = this.unit.find('player')
    if (!player) { return }
    if (player.isAdd) {
        player.isAdd = false
        const stick = this.unit.find('treeNear'),
            hatman = {
                id: 'hatman',
                x: 420,
                y: 53,
                textArr: [`hatman: "Wow, you created me.You should try to press 'z' to delete sprite."`]
            }
        this.unit.add(npc(hatman.id, hatman.x, hatman.y, this.height, Game.animations['hatman'], hatman.textArr, stick))

        // 删除事件
        this.event.del('addNpc')
    }
}