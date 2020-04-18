class Event {
    // 游戏事件
    static play() {
        !Stage.star && !Stage.player.jumping && this.createStar()
        this.eatStar()
    }

    // 创建星星
    static createStar() {
        const R = 10 + Math.random() * 10,
            x = 50 + Math.random() * (Canvas.width - 100),
            y = 70 + Math.random() * (Canvas.height - 150),
            rot = Math.random() * 180
        Stage.star = { R, x, y, rot }
    }

    // 吃星星
    static eatStar() {
        if (Stage.star && PyhsicsEngine.touch(Stage.player, Stage.star)) {
            Stage.player.score++
            Stage.star = null
        }
    }
}