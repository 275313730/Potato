export function player(x) {
    return {
        config: {
            id: 'player',
            x,
            width: 40,
            direction: x === 10 ? 'right' : 'left',
            layer: 2,
        },
        data: {
            shoot: false,
            speed: 2,
            space: false,
            walking: false,
            mousedown: false
        },
        methods: {
            // 移动
            move(direction) {
                this.direction = direction
                this.draw.animation(this.id, 'walk')
                this.walking = true
            },
            // 停止
            stop() {
                this.draw.animation(this.id, 'idle')
                this.walking = false
            }
        },
        created() {
            this.draw.animation(this.id, 'idle')
            this.userEvent.add(keyDown, 'keydown', true)
            this.userEvent.add(keyUp, 'keyup')
            this.userEvent.add(mouseDown, 'mousedown', true)
            this.userEvent.add(mouseUp, 'mouseup')
            this.userEvent.add(mouseMove, 'mousemove')
            this.event.add(walk)
            this.y = this.game.height - this.height
        }
    }

    // 键盘按下
    function keyDown(key) {
        switch (key) {
            case 'ArrowRight':
                this.move('right')
                break
            case 'ArrowLeft':
                this.move('left')
                break
            case ' ':
                this.space = true
                break
            case 'z':
                this.shoot = true
                break
        }
    }

    // 键盘松开
    function keyUp(key) {
        switch (key) {
            case 'ArrowRight':
                if (this.direction === 'left') { return }
                this.stop()
                break
            case 'ArrowLeft':
                if (this.direction === 'right') { return }
                this.stop()
                break
            case ' ':
                this.space = false
                break
            case 'z':
                this.shoot = false
                break
        }
    }

    // 鼠标按下移动
    function mouseDown(mouse) {
        this.mousedown = true
        if (mouse.x <= this.relX) {
            this.move('left')
        } else if (mouse.x >= this.relX + this.width) {
            this.move('right')
        }
    }

    // 鼠标松开停止
    function mouseUp() {
        this.mousedown = false
        this.stop()
    }

    // 鼠标决定移动方向
    function mouseMove(mouse) {
        if (!this.mousedown) { return }
        if (mouse.x <= this.relX) {
            this.direction = 'left'
        } else if (mouse.x >= this.relX + this.width) {
            this.direction = 'right'
        }
    }

    // 移动
    function walk() {
        if (this.walking === false) { return }
        if (this.direction === 'right' && this.x < this.stage.width - this.width) {
            this.x += this.speed
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
        }
    }
}