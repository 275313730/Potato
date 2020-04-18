class Canvas {
    // 页面绘制
    static draw() {
        this.clear()
        this.drawBackground()
        this.drawPlayer(Stage.player)
        this.drawStar(Stage.star)
        this.drawText(Stage.player, Stage.star)
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

    // 绘制玩家
    static drawPlayer(player) {
        this.ctx.fillStyle = player.color
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y - player.radius, player.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制星星
    static drawStar(star) {  // R:外接圆半径，x: x方向圆心位置 y: y方向圆心位置，rot:旋转角度
        if (star) {
            this.ctx.fillStyle = 'yellow'
            this.ctx.beginPath();
            for (var i = 0; i < 5; i++) {
                //因为角度是逆时针计算的，而旋转是顺时针旋转，所以是度数是负值。
                this.ctx.lineTo(star.x + Math.cos((18 + 72 * i - star.rot) / 180 * Math.PI) * star.R,
                    star.y - Math.sin((18 + 72 * i - star.rot) / 180 * Math.PI) * star.R);
                this.ctx.lineTo(star.x + Math.cos((54 + 72 * i - star.rot) / 180 * Math.PI) * star.R / 2,
                    star.y - Math.sin((54 + 72 * i - star.rot) / 180 * Math.PI) * star.R / 2);
            }
            this.ctx.fill();
        }
    }

    // 绘制对话框
    static drawDialog() {
        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(this.width / 4, this.height / 2, this.width / 2, this.height / 3)
    }

    // 绘制文字
    static drawText(player,star) {
        if (player.jumping && !star) {
            this.ctx.fillStyle = 'red'
        } else {
            this.ctx.fillStyle = 'black'
        }
        this.ctx.font = "25px serif";
        this.ctx.fillText(`Scroe:${player.score}`, 10, 30);
    }
}