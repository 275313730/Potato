import { Sprite } from "../../modules/Sprite.js";

export function npc(id, x, textArr) {
    const options = {
        // sprite属性
        id,
        x,
        y: 1,
        direction: 'left',

        // 自定义属性
        type: 'npc',
        talking: false,
        textArr,
        textCount: 0,
        moveStatus: 0,
        waitTime: 0,
        speed: 1,
        stop
    }

    function move() {
        // 静止
        if (this.moveStatus === 0 && !this.talking) {
            this.stop()
            this.moveStatus = 1
            if (Math.random() > 0.5) {
                this.speed = -this.speed
            }
        }

        // 准备移动
        if (this.moveStatus === 1) {
            if (this.waitTime < 200) {
                this.waitTime++
            } else {
                this.moveStatus = 2
                this.waitTime = 0
                this.direction = this.speed > 0 ? 'right' : 'left'
                this.draw.animation(this.id, 'walk')
            }
        }

        // 移动
        if (this.moveStatus === 2) {
            this.x += this.speed
            this.waitTime++
            if (this.x < 0 || this.x > this.stage.width - this.width) {
                this.speed = -this.speed
                this.direction = this.speed > 0 ? 'right' : 'left'
            }
            if (this.waitTime > 300) {
                this.moveStatus = 0
                this.waitTime = 0
            }
        }

        // 谈话打断移动
        if (this.talking && this.moveStatus > 0) {
            this.stop()
            return
        }
    }

    // 停止移动
    function stop() {
        this.moveStatus = 0
        this.draw.animation(this.id, 'stay')
    }

    return new Sprite(options, function () {
        this.event.add(move)
        this.draw.animation(this.id, 'stay')
        this.y = this.game.height - this.height
    })
}