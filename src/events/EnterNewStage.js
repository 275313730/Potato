import { Game } from "../../modules/Game.js";

export function enterNewStage(mapId) {
    const player = this.unit.find('player')
    if (player.relX >= this.width - player.width) {
        Game.stage.switch('forest', mapId + 1)
        return
    }
    if (player.relX <= 0 && mapId > 0) {
        const playerX = player.stick.width - player.width,
            stickX = this.width - player.stick.width - 10
        Game.stage.switch('forest', mapId + 1, playerX, stickX)
    }
}