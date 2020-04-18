class PyhsicsEngine {
    // 物理引擎
    static run() {
        this.gravity(Stage.player)
        this.move(Stage.player)
    }

    // 重力系统
    static gravity(player) {
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

    // 移动
    static move(player) {
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

    // 碰撞
    static touch(player, unit) {
        if (Math.abs(player.x - unit.x) < player.radius && Math.abs(player.y - unit.y) < player.radius) {
            return true
        }
        return false
    }
}