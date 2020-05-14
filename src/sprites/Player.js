export function player() {
    return {
        config: {
            id: 'player',
            x: 10,
            y: 66,
            width: 28,
            height: 30,
            offsetLeft: -19,
            offsetTop: -13,
            direction: 'right',
            layer: 2,
        },
        data: {
            collie: null,
            attackStatus: 0,
            speed: 2,
            space: false,
            walking: false,
            jumpStatus: 0,
            vSpeed: 0,
        },
        methods: {
            // 移动
            move(direction) {
                this.walking = true
                if (this.attackStatus > 0 || this.jumpStatus === 3 || this.hitting) { return }
                this.direction = direction
                this.graphics.animation(this.id, 'walk')
            },
            // 停止
            stop() {
                this.walking = false
                if (this.attackStatus > 0 || this.jumpStatus > 0 || this.hitting) { return }
                this.graphics.animation(this.id, 'idle')
                this.jumpStatus = 0
            },
            // 攻击
            attack() {
                if (this.jumpStatus > 0 || this.hitting) { return }
                this.attackStatus = 1
                this.graphics.wait(4, () => {
                    this.attackStatus = 2
                    this.graphics.animation(this.id, 'attack')
                        .onComplete = () => {
                            this.attackStatus = 0
                            if (this.walking) {
                                this.move(this.direction)
                            } else {
                                this.stop()
                            }
                        }
                })
            },
            // 跳跃
            jump() {
                if (this.jumpStatus > 0 || this.attackStatus > 0 || this.hitting) { return }
                this.jumpStatus = 1
                this.graphics.image(this.id, 'jump')
                this.vSpeed = 12
            },
            // 掉落
            fall() {
                this.jumpStatus = 2
                this.graphics.image(this.id, 'fall')
            },
            // 落地
            ground() {
                this.jumpStatus = 3
                this.graphics.image(this.id, 'ground')
                this.graphics.wait(8, () => {
                    this.hitting = false
                    this.jumpStatus = 0
                    if (this.walking) {
                        this.move(this.direction)
                    } else {
                        this.stop()
                    }
                })
            },
            // 受伤
            hit() {
                if (this.hitting) { return }
                this.hitting = true
                this.attackStatus = 0
                this.graphics.animation(this.id, 'hit')
                    .onComplete = () => {
                        this.graphics.wait(8, () => {
                            this.hitting = false
                            if (this.jumpStatus === 3) { return }
                            if (this.walking) {
                                this.move(this.direction)
                            } else {
                                this.stop()
                            }
                        })
                    }
            },
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
            case 'a':
                this.move('left')
                break
            case 'd':
                this.move('right')
                break
            case ' ':
                this.jump()
                break
            case 'j':
                this.hit()
                break
        }
    }

    // 键盘松开
    function keyUp(key) {
        switch (key) {
            case 'a':
                if (this.direction === 'right') { return }
                this.stop()
                break
            case 'd':
                if (this.direction === 'left') { return }
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
        if (this.walking === false || this.jumpStatus === 3 || this.hitting || this.attackStatus > 0) { return }
        if (this.direction === 'right' && this.x < this.stage.width - this.width) {
            this.x += this.speed
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
        }
    }

    function jumpMove() {
        if (this.jumpStatus === 0 || this.jumpStatus === 3) { return }
        this.y -= this.vSpeed
        if (this.vSpeed >= -4) {
            this.vSpeed--
            if (this.vSpeed === 0 && this.jumpStatus === 1) {
                this.fall()
            }
        }
    }
}