import { Sprite } from "../../modules/Sprite.js";

export function npc(id, x, y, sh, animations, textArr, stick) {
    const options = {
        // sprite属性
        id,
        x,
        y: sh - y,
        width: 40,
        speed: 1,
        direction: 4,
        stick,
        animations,

        // 自定义属性
        type: 'npc',
        talking: false,
        textArr,
        textCount: 0,
        moveStatus: 0,
        stop
    }

    function move() {
        // 静止=>移动
        if (this.moveStatus === 0 && !this.talking) {
            this.moveStatus = 1
            this.moveTimer = setTimeout(() => {
                this.moveStatus = 2
                if (Math.random() > 0.5) {
                    this.speed = -this.speed
                }
                this.direction = this.speed > 0 ? 6 : 4
                this.draw.animation('walk')
                clearTimeout(this.moveTimer)
                // 移动=>静止
                this.moveTimer = setTimeout(() => {
                    this.stop()
                }, 1000 + Math.random() * 2000);
            }, 1000 + Math.random() * 2000);
        }

        // 谈话打断移动
        if (this.talking && this.moveStatus > 0) {
            clearTimeout(this.moveTimer)
            this.stop()
            return
        }

        // 移动中
        if (this.moveStatus === 2) {
            this.x += this.speed
            if (this.x < 0 || this.x > this.stick.width - this.width) {
                this.speed = -this.speed
                this.direction = this.speed > 0 ? 6 : 4
            }
        }
    }


    function stop() {
        this.moveStatus = 0
        this.draw.animation('stay')
    }

    return new Sprite(options, function () {
        this.event.add(move)
        this.draw.animation('stay')
    })
}