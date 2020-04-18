function star() {
    return new Sprite({
        id: 'star',
        color: 'yellow',
        R: 10 + Math.random() * 10,
        x: 50 + Math.random() * (Canvas.width - 100),
        y: 70 + Math.random() * (Canvas.height - 150),
        rot: Math.random() * 180
    })  // 实例化后执行
        // 绑定图形
        .bindDraw('init', function () {
            // 获取实例
            const star = Sprite.sprites['star']
            if (star) {
                this.ctx.fillStyle = star.color
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
        })
        // 绑定事件
        .bindEvent('touch', function () {
            Stage.player.score++
            Sprite.delete(this.id)
        })
}
