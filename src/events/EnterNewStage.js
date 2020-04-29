import { Game } from "../../modules/Game.js"

export function enterNewStage(mapId) {
    const player = this.sprite.find('player')

    // 玩家的哼左边与场景右边缘对齐时
    if (player.x >= this.width - player.width && mapId === 0) {
        Game.stage.switch('forest', mapId + 1)
        return
    }
    // 玩家的横坐标与场景左边缘对齐时
    if (player.x <= 0 && mapId > 0 && mapId === 1) {
        // 从左侧进入场景需要将横坐标设置在场景右边缘
        const playerX = this.width - player.width - 10
        Game.stage.switch('forest', mapId - 1, playerX)
    }
}