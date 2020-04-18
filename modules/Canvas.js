class Canvas {
    static init() {
        Canvas.draws['backGround'] = this.drawBackground.bind(this)
        Canvas.draws['player'] = this.drawPlayer.bind(this)
        Canvas.draws['text'] = this.drawText.bind(this)
    }

    // 页面绘制
    static draw() {
        this.clear()
        for (const key in Canvas.draws) {
            Canvas.draws[key]()
        }
    }

    // 清除页面
    static clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    // 绘制轮廓
    static drawBackground() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    static drawPlayer() {
        const player = Stage.player
        this.ctx.fillStyle = player.color
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y - player.radius, player.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制对话框
    static drawDialog() {
        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(this.width / 4, this.height / 2, this.width / 2, this.height / 3)
    }

    // 绘制文字
    static drawText() {
        const player = Stage.player,
            star = Sprite.sprites['star']
        if (player.jumping && !star) {
            this.ctx.fillStyle = 'red'
        } else {
            this.ctx.fillStyle = 'black'
        }
        this.ctx.font = "25px serif";
        this.ctx.fillText(`Scroe:${player.score}`, 10, 30);
    }
}

Canvas.draws = {}