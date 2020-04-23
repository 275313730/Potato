import { Sprite } from "../../modules/Sprite.js";

export function bullet(sw, player, stick) {
    const options = {
        id: 'bullet',
        x: player.x + player.direction * 4,
        y: player.y + 20,
        stick,
        direction: player.direction
    }

    function draw(ctx) {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.relX, this.y, 6, 2)
    }

    function move() {
        if (this.relX < sw && this.relX >= 0) {
            if (this.direction === 6) {
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