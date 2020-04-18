class Engine {
    // 执行引擎事件
    static run() {
        this.gravity()
        this.move()
    }

    // 重力事件
    static gravity() {
        const player = Stage.player
        if (!player.jumping) { return }
        player.y -= player.v
        if (player.y < Canvas.height) {
            player.v -= 0.55
        } else {
            player.v = 0
            player.y = Canvas.height
            player.jumping = false
        }
    }

    // 移动事件
    static move() {
        const player = Stage.player

        if (!player.moving) { return }

        if (player.direction === 'd' && player.x + player.radius < Canvas.width) {
            player.x += player.speed
            return
        }

        if (player.direction === 'a' && player.x - player.radius > 0) {
            player.x -= player.speed
            return
        }
        player.moving = false
    }

    // 碰撞事件
    static touch() {
        const player = Stage.player
        if (Math.abs(player.x - this.x) < player.radius + this.R && Math.abs(player.y - this.y) < player.radius + this.R) {
            return true
        }
        return false
    }
}