import { Sprite } from "../../modules/Sprite.js";

export function bullet(player) {
    const options = {
        id: 'bullet',
        x: player.x + player.width / 2,
        y: 20,
        direction: player.direction
    }

    function draw(ctx) {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.relX, this.game.height - this.y, 6, 2)
    }

    function move() {
        if (this.relX < this.game.width && this.relX > 0) {
            if (this.direction === 'right') {
                this.x += 5
            } else {
                this.x -= 5
            }
        }
    }

    return new Sprite(options, function () {
        this.draw.shape(draw)
        this.event.add(move)
    })
}