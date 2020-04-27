import { Sprite } from "../../modules/Sprite.js";

export function enemy(name, number, player) {
    const options = {
        // sprite属性
        id: 'hyena' + number,
        x: 200 + number * 100,
        direction: 'left',
        layer: 2,

        // 自定义属性
        type: 'enemy',
        name,
        moveStatus: 0,
        speed: 0.5 + Math.random(),
        attack
    }

    function move() {
        // 静止
        if (this.moveStatus === 0 && (this.x < player.x || this.x > player.x + player.width)) {
            if (player.x < this.x) {
                this.direction = 'left'
            } else {
                this.direction = 'right'
            }
            this.moveStatus = 1
            this.draw.animation(this.name, 'walk')
        }

        // 移动
        if (this.moveStatus === 1) {
            if (this.x <= player.x + player.width - this.width / 2 && this.x >= player.x - this.width / 2) {
                this.attack()
                return
            }
            if (this.direction === 'left') {
                this.x -= this.speed
            } else {
                this.x += this.speed
            }
        }
    }

    // 攻击
    function attack() {
        this.moveStatus = 0
        this.draw.animation(this.name, 'attack')
    }

    return new Sprite(options, function () {
        this.event.add(move)
        this.draw.animation(this.name, 'idle')
        this.y = this.game.height - this.height
    })
}