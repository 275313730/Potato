import { Game } from "../../modules/Game.js";
import { npc } from "../sprites/Npc.js";

export function addNpc() {
    if (Game.key === 'Escape') {
        // hatman数据
        const hatman = {
            id: 'hatman',
            x: 420,
            textArr: [`hatman: "Wow, you created me.You should try to press 'z' to delete sprite."`],
        }

        let newHatMan = npc(hatman.id, hatman.x, hatman.textArr)

        // 添加hatman
        this.sprite.add(newHatMan)

        // 删除当前事件
        this.event.del('addNpc')
    }
}