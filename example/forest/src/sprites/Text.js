export function text() {
    return {
        config: {
            id: 'text',
        },
        data: {
            txt: null
        },
        created() {
            this.x = this.game.width / 2
            this.y = this.game.height / 2
            this.graphics.draw(draw)
        }
    }

    // 绘制
    function draw(ctx) {
        if (this.txt !== null) {
            ctx.fillStyle = 'red'
            ctx.font = '14px pixel'
            ctx.centerText(this.txt, this.x, this.y)
        }
    }
}