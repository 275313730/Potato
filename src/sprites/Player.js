export function player() {
    return {
        config: {
            id: 'player',
            x: 10,
            y: 66,
            width: 30,
            height: 30,
            offsetLeft: -18,
            offsetTop: -13,
            direction: 'right',
            layer: 2,
        },
        data: {
            collie: false,
            attacking: false,
            speed: 2,
            space: false,
            walking: false,
            pressing: false,
            jumpStatus: 0,
            vSpeed: 0
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
                this.jumpStatus = 0
            },
            // 攻击
            attack() {
                if (this.jumpStatus !== 0) { return }
                this.stop()
                this.attacking = true
                this.graphics.animation(this.id, 'attack', false)
                    .onComplete = () => {
                        if (this.pressing) {
                            this.attacking = false
                            this.move(this.direction)
                        } else {
                            this.stop()
                        }
                    }
            },
            // 跳跃
            jump() {
                this.jumpStatus = 1
                this.graphics.image(this.id, 'jump', false)
                this.vSpeed = 12
            },
            // 掉落
            fall() {
                this.jumpStatus = 2
                this.graphics.image(this.id, 'fall', false)
            },
            // 落地
            ground() {
                this.jumpStatus = 0
                this.graphics.image(this.id, 'ground', false)
                this.disabled = true
                setTimeout(() => {
                    this.disabled = false
                    if (this.walking) {
                        this.move(this.direction)
                    } else {
                        this.stop()
                    }
                }, 120)
            }
        },
        created() {
            this.stop()
            this.userEvent.add(keyDown, 'keydown', true)
            this.userEvent.add(keyUp, 'keyup')
            this.userEvent.add(mouseDown, 'mousedown', true)
            this.event.add(walk)
            this.event.add(jumpMove)
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
                this.jumpStatus === 0 && !this.attacking && this.jump()
                break
        }
    }

    // 键盘松开
    function keyUp(key) {
        switch (key) {
            case 'd':
                if (this.direction === 'left') { return }
                this.pressing = false
                this.stop()
                break
            case 'a':
                if (this.direction === 'right') { return }
                this.pressing = false
                this.stop()
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

    function jumpMove() {
        if (this.jumpStatus === 0) { return }
        this.y -= this.vSpeed
        if (this.vSpeed >= -4) {
            this.vSpeed--
            if (this.vSpeed < 0 && this.jumpStatus === 1) {
                this.fall()
            }
        }
    }
}