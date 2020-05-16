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
            walkDirection: null,
            hitting: false,
            jumpStatus: 0,
            vSpeed: 0,
        },
        methods: {
            // 移动
            move(direction) {
                this.walkDirection = direction
                if (this.attackStatus > 0 || this.jumpStatus === 3 || this.hitting) { return }
                this.direction = this.walkDirection
                this.graphics.animation(this.id, 'walk')
            },
            // 停止
            stop() {
                this.walkDirection = null
                if (this.attackStatus > 0 || this.jumpStatus > 0 || this.hitting) { return }
                this.graphics.animation(this.id, 'idle')
                this.jumpStatus = 0
            },
            // 攻击
            attack() {
                if (this.jumpStatus > 0 || this.hitting || this.attackStatus > 0) { return }
                this.attackStatus = 1
                this.event.add(wait(4, () => {
                    this.attackStatus = 2
                    this.graphics.animation(this.id, 'attack')
                        .onComplete = () => {
                            this.attackStatus = 0
                            this.restore()
                        }
                }))
            },
            // 跳跃
            jump() {
                if (this.jumpStatus > 0 || this.attackStatus > 0 || this.hitting) { return }
                this.jumpStatus = 1
                this.graphics.image(this.id, 'jump')
                this.vSpeed = 8
            },
            // 掉落
            fall() {
                this.jumpY = this.y
                this.jumpStatus = 2
                this.graphics.image(this.id, 'fall')
            },
            // 落地
            ground() {
                if (this.y - this.jumpY > 32 * 3) {
                    this.jumpStatus = 3
                    this.graphics.image(this.id, 'ground')
                    this.event.add(wait(6, () => {
                        this.hitting = false
                        this.jumpStatus = 0
                        this.restore()
                    }))
                } else {
                    this.hitting = false
                    this.jumpStatus = 0
                    this.restore()
                }
                this.vSpeed = 0
            },
            // 受伤
            hit() {
                if (this.hitting) { return }
                this.hitting = true
                this.attackStatus = 0
                this.graphics.animation(this.id, 'hit')
                    .onComplete = () => {
                        this.event.add(wait(8, () => {
                            this.hitting = false
                            if (this.jumpStatus === 3) { return }
                            this.restore()
                        }))
                    }
            },
            restore() {
                if (this.walkDirection) {
                    this.move(this.walkDirection)
                } else {
                    this.stop()
                }
            },
        },
        created() {
            this.stop()
            this.userEvent.add(keyDown, 'keydown', true)
            this.userEvent.add(keyUp, 'keyup')
            this.userEvent.add(mouseDown, 'mousedown', true)
            this.event.add(walkMove)
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
                if (this.walkDirection === 'right') { return }
                this.stop()
                break
            case 'd':
                if (this.walkDirection === 'left') { return }
                this.stop()
                break
        }
    }

    // 鼠标按下攻击
    function mouseDown(e) {
        if (e.button === 0) {
            !this.attacking && this.attack()
        }
    }

    // 移动
    function walkMove() {
        if (this.walkDirection === null || this.jumpStatus === 3 || this.hitting || this.attackStatus > 0) { return }
        if (this.direction === 'right' && this.x < this.stage.width - this.width) {
            this.x += this.speed
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
        }
    }

    function jumpMove() {
        if (this.jumpStatus === 0 || this.jumpStatus === 3) { return }
        this.y -= this.vSpeed
        if (this.vSpeed > -4) {
            this.vSpeed -= 0.5
            if (this.vSpeed === 0 && this.jumpStatus === 1) {
                this.fall()
            }
        }
    }

    function wait(interval, callback) {
        let count = 0
        return function wait() {
            count++
            if (count >= interval) {
                this.event.del('wait')
                callback()
            }
        }
    }
}