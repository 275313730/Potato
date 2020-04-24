import { Sprite } from "../../modules/Sprite.js";

export function mapName( mapId) {
    const options = {
        id: `Forest ${mapId}`,
        y: 15
    }

    function draw(ctx) {
        ctx.fillStyle = 'red'
        ctx.font = '12px pixel'
        ctx.centerText(this.id, this.game.width / 2, this.y)
    }

    return new Sprite(options, function () {
        this.draw.shape(draw)
    })
}