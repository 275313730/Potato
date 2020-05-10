export function player(x) {
    return {
        config: {
            id: 'player',
            x,
            width: 30,
            height: 30,
            offsetLeft: -18,
            offsetTop: -16,
            direction: x === 10 ? 'right' : 'left',
            layer: 2,
        },
        data: {
            shoot: false,
            speed: 2,
            space: false,
            walking: false,
        },
        methods: {
            // 移动
            move(direction) {
                this.direction = direction
                this.graphics.animation(this.id, 'walk', false)
                this.walking = true
            },
            // 停止
            stop() {
                this.graphics.animation(this.id, 'idle', false)
                this.walking = false
            }
        },
        created() {
            this.stop()
            this.userEvent.add(keyDown, 'keydown', true)
            this.userEvent.add(keyUp, 'keyup')
            this.userEvent.add(mouseDown, 'mousedown', true)
            this.userEvent.add(mouseUp, 'mouseup')
            this.event.add(walk)
            this.y = this.game.height - this.height
        }
    }

    // 键盘按下
    function keyDown(key) {
        switch (key) {
            case 'd':
                this.move('right')
                break
            case 'a':
                this.move('left')
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

    // 鼠标按下射击
    function mouseDown(mouse) {
        this.shoot = true
    }

    // 鼠标松开停止
    function mouseUp() {
        this.shoot = false
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