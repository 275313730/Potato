import { Game } from "../../modules/Game.js"

export function enterNewStage(mapId) {
    const player = this.unit.find('player')
    if (player.x >= player.stick.width - player.width) {
        Game.stage.switch('forest', mapId + 1)
        return
    }
    if (player.x <= 0 && mapId > 0) {
        const playerX = player.stick.width - player.width,
            stickX = Game.width - player.stick.width - 10
        Game.stage.switch('forest', mapId - 1, playerX, stickX)
    }
}