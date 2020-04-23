import { Sprite } from "../../modules/Sprite.js";
import { Stage } from "../../modules/Stage.js";

export function mapName(mapId) {
    const options = {
        id: `Forest ${mapId}`,
        x: Stage.width / 2,
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