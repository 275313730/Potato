import { Sprite } from "../../modules/Sprite.js";

export function warning() {
    const options = {
        id: 'warning'
    }

    function draw(ctx) {
        ctx.fillStyle = 'red'
        ctx.font = '14px pixel'
        ctx.centerText('No shoot in this map.', this.x, this.y)
    }

    return new Sprite(options, function () {
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.draw.shape(draw)
    })
}