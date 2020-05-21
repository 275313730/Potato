export function exp() {
    return {
        config: {
            id: 'exp',
            layer: 4,
            alpha: 0
        },
        data: {
            exp: 0,
            expNeed: 10
        },
        created() {
            this.graphics.draw(draw)
            this.userEvent.watch('keydown', keyDown)
            this.userEvent.watch('keyup', keyUp)
            this.$pox.watch('player.exp', value => {
                this.exp = value
            })
        }
    }

    function draw(ctx) {
        ctx.strokeStyle = 'black'
        ctx.strokeRect(10, 10, 50, 10)
        ctx.fillStyle = '#37b35e'
        ctx.fillRect(11, 11, this.exp * 50 / this.expNeed, 8)
    }

    function keyDown(key) {
        if (key === 'Tab') {
            this.alpha = 1
        }
    }

    function keyUp(key) {
        if (key === 'Tab') {
            this.alpha = 0
        }
    }
}