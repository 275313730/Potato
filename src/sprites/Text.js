import { Sprite } from "../../modules/Sprite.js";

export function text() {
    const options = {
        id: 'text',
        txt: null
    }

    // 绘制
    function draw(ctx) {
        if (this.txt !== null) {
            ctx.fillStyle = 'red'
            ctx.font = '14px pixel'
            ctx.centerText(this.txt, this.x, this.y)
        }
    }

    return new Sprite(options, function () {
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.draw.shape(draw)
    })
}