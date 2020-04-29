import { Sprite } from "../../modules/Sprite.js";
import { Game } from "../../modules/Game.js";

export function text() {
    const options = {
        id: 'text',
        txt: null
    }

    // 绘制
    function draw(ctx) {
        ctx.fillStyle = 'red'
        ctx.font = '14px pixel'
        if (this.txt === null) {
            if (Game.key === null) {
                ctx.centerText('', this.x, this.y)
            } else if (Game.key === ' ') {
                ctx.centerText('space', this.x, this.y)
            } else {
                ctx.centerText(Game.key, this.x, this.y)
            }
        } else {
            ctx.centerText(this.txt, this.x, this.y)
        }
    }

    return new Sprite(options, function () {
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.draw.shape(draw)
    })
}