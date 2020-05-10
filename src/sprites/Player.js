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
            attacking: false,
            speed: 2,
            space: false,
            walking: false,
            pressing: false
        },
        methods: {
            // 移动
            move(direction) {
                if (this.attacking) { return }
                this.direction = direction
                this.graphics.animation(this.id, 'walk', false)
                this.walking = true
                this.pressing = true
            },
            // 停止
            stop() {
                if (this.attacking) { return }
                this.graphics.animation(this.id, 'idle', false)
                this.walking = false
            },
            // 攻击
            attack() {
                this.stop()
                this.attacking = true
                this.graphics.animation(this.id, 'attack', false)
                    .onComplete = () => {
                        this.attacking = false
                        if (this.pressing) {
                            this.move(this.direction)
                        } else {
                            this.stop()
                        }
                    }
            }
        },
        created() {
            this.stop()
            this.userEvent.add(keyDown, 'keydown', true)
            this.userEvent.add(keyUp, 'keyup')
            this.userEvent.add(mouseDown, 'mousedown', true)
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
        this.pressing = false
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

    // 鼠标按下攻击
    function mouseDown() {
        !this.attacking && this.attack()
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