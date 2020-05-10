export function npc(id, x, textArr) {
    return {
        config: {
            id,
            x,
            direction: 'left',
            layer: 1,
        },
        data: {
            type: 'npc',
            talking: false,
            textArr,
            textIndex: 0,
            moveStatus: 0,
            waitTime: 0,
            speed: 1,
        },
        methods: {
            // 停止移动
            stop() {
                this.moveStatus = 0
                this.graphics.animation(this.id, 'idle')
            }
        },
        created() {
            this.event.add(move)
            this.stop()
            this.y = this.game.height - this.height
        }
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
                this.graphics.animation(this.id, 'walk')
            }
        }

        // 移动
        if (this.moveStatus === 2) {
            this.x += this.speed
            this.waitTime++
            // 撞墙折返
            if (this.x < 0 || this.x > this.stage.width - this.width) {
                this.speed = -this.speed
                this.direction = this.speed > 0 ? 'right' : 'left'
            }
            if (this.waitTime > 150) {
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
}