import { Stage } from "../../modules/Stage/Stage.js"
import { forest } from "../stages/Forest.js"

export function enterNewStage(player, mapId) {
    // 玩家的右边缘与场景右边缘对齐时
    if (player.x + player.width >= this.width && mapId === 0) {
        new Stage(forest(1))
        return
    }
    // 玩家的左边缘与场景左边缘对齐时
    if (player.x <= 0 && mapId > 0 && mapId === 1) {
        // 从左侧进入场景需要将横坐标设置在场景右边缘
        const playerX = this.width - player.width - 10
        new Stage(forest(0, playerX))
    }
}