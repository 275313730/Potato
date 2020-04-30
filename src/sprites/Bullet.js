import { Sprite } from "../../modules/Sprite.js";

export function bullet(player) {
    const options = {
        id: 'bullet',
        x: player.x + player.width / 2,
        width: 6,
        height: 2,

        speed: 5,
        direction: player.direction
    }

    // 绘制
    function draw(ctx) {
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.relX, this.y, this.width, this.height)
    }

    // 移动
    function move() {
        if (this.relX < this.game.width && this.relX > 0) {
            if (this.direction === 'right') {
                this.x += this.speed
            } else {
                this.x -= this.speed
            }
        }
    }

    return new Sprite(options, function () {
        this.y = this.game.height - 20
        this.draw.shape(draw)
        this.event.add(move)
    })
}