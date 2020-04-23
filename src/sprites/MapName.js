import { Sprite } from "../../modules/Sprite.js";

export function mapName(sw, mapId) {
    const options = {
        id: `Forest ${mapId}`,
        x: sw / 2,
        y: 15
    }

    function draw(ctx) {
        ctx.fillStyle = 'red'
        ctx.font = '12px pixel'
        ctx.centerText(this.id, this.x, this.y)
    }

    return new Sprite(options, function () {
        this.draw.shape(draw)
    })
}