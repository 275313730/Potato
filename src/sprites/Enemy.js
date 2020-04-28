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
        action: 0,
        speed: 0.5 + Math.random()
    }

    function move() {
        // 根据位置调整方向
        if (player.x < this.x) {
            this.direction = 'left'
        } else {
            this.direction = 'right'
        }

        // 静止
        if (this.action === 0 && (this.x < player.x || this.x > player.x + this.width / 2)) {
            this.action = 1
            this.draw.animation(this.name, 'walk')
        }

        // 移动
        if (this.action === 1) {
            // 如果距离小于敌人宽度/2，执行攻击
            if (Math.abs(this.x - player.x) <= this.width / 2) {
                // 播放攻击动画
                this.draw.animation(this.name, 'attack')
                this.action = 2
                return
            }

            // 根据方向判断位移
            if (this.direction === 'left') {
                this.x -= this.speed
            } else {
                this.x += this.speed
            }
        }

        // 如果距离大于敌人宽度/2，停止攻击
        if (this.action === 2 && Math.abs(this.x - player.x) > this.width / 2) {
            this.action = 0
        }
    }

    return new Sprite(options, function () {
        this.event.add(move)
        this.draw.animation(this.name, 'idle')
        this.y = this.game.height - this.height
    })
}