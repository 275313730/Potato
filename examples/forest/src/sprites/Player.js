export function player() {
    return {
        config: {
            id: 'player',
            x: 10,
            width: 40,
            height: 48,
            direction: 'right',
            layer: 2,
        },
        data: {
            speed: 1.5,
            space: false,
        },
        methods: {
            walk(direction) {
                this.direction = direction
                this.graphics.animation(this.id, 'walk')
                this.event.add(this.move)
            },
            stop() {
                this.graphics.animation(this.id, 'idle')
                this.event.del('move')
            },
            move() {
                if (this.direction === 'right' && this.x < this.stage.width - this.width) {
                    this.x += this.speed
                } else if (this.direction === 'left' && this.x > 0) {
                    this.x -= this.speed
                }
            }
        },
        created() {
            this.stop()
            this.userEvent.watch('keydown', keyDown)
            this.userEvent.watch('keyup', keyUp)
            this.y = this.game.height - this.height
        }
    }

    // 键盘按下
    function keyDown(key) {
        switch (key) {
            case 'd':
                this.walk('right')
                break
            case 'a':
                this.walk('left')
                break
            case ' ':
                this.space = true
                break
        }
    }

    // 键盘松开
    function keyUp(key) {
        switch (key) {
            case 'd':
                if (this.direction === 'left') { return }
                this.stop()
                break
            case 'a':
                if (this.direction === 'right') { return }
                this.stop()
                break
            case ' ':
                this.space = false
                break
        }
    }
}