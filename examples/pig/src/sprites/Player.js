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
            exp: 0,
            collie: null,
            state: 'stop',
            speed: 2,
            attacking: false,
            walkDirection: null,
            vSpeed: 0,
        },
        methods: {
            walk() {
                this.direction = this.walkDirection
                this.graphics.animation(this.id, 'walk')
            },
            stop() {
                this.graphics.animation(this.id, 'idle')
            },
            attack() {
                this.event.add(wait(4, () => {
                    this.attacking = true
                    this.graphics.animation(this.id, 'attack')
                        .onComplete = () => {
                            this.attacking = false
                            this.restore()
                        }
                }))
            },
            jump() {
                this.graphics.image(this.id, 'jump')
                this.vSpeed = 8
            },
            fall() {
                this.jumpTop = this.y
                this.graphics.image(this.id, 'fall')
            },
            ground() {
                this.vSpeed = 0
                if (this.y - this.jumpTop > 32 * 3) {
                    this.graphics.image(this.id, 'ground')
                    this.event.add(wait(6, () => {
                        this.restore()
                    }))
                } else {
                    this.restore()
                }
            },
            hit() {
                this.graphics.animation(this.id, 'hit')
                    .onComplete = () => {
                        this.event.add(wait(8, () => {
                            this.restore()
                        }))
                    }
            },
            restore() {
                if (this.walkDirection) {
                    this.$potate.setState('walk')
                } else {
                    this.$potate.setState('stop')
                }
            },
            initState() {
                this.$potate.addState('stop', this.stop)
                this.$potate.addState('walk', this.walk)
                this.$potate.addState('ground', this.ground)
                this.$potate.addState('attack', this.attack, nextState => {
                    if (nextState === 'stop' || nextState === 'walk') { return true }
                })
                this.$potate.addState('jump', this.jump, nextState => {
                    if (nextState === 'fall') { return true }
                })
                this.$potate.addState('fall', this.fall, nextState => {
                    if (nextState === 'ground') { return true }
                })
                this.$potate.addState('hit', this.hit, nextState => {
                    if (nextState === 'stop') { return true }
                })

                this.$potate.setState('stop')
            }
        },
        created() {
            this.initState()
            this.userEvent.watch('keydown', keyDown)
            this.userEvent.watch('keyup', keyUp)
            this.userEvent.watch('mousedown', mouseDown)
            this.event.add(walkMove)
            this.event.add(jumpMove)
            this.$pox.watch('deaths', () => {
                this.$pox.set('player.exp', value => { return value + 1 })
            })
        }
    }

    function keyDown(key) {
        switch (key) {
            case 'a':
                this.walkDirection = 'left'
                if (this.$potate.getState() === 'attack') { return }
                this.direction = this.walkDirection
                this.$potate.setState('walk')
                break
            case 'd':
                this.walkDirection = 'right'
                if (this.$potate.getState() === 'attack') { return }
                this.direction = this.walkDirection
                this.$potate.setState('walk')
                break
            case ' ':
                this.$potate.setState('jump')
                break
        }
    }

    function keyUp(key) {
        switch (key) {
            case 'a':
                if (this.walkDirection === 'right') { return }
                this.walkDirection = null
                if (this.$potate.getState() === 'attack') { return }
                this.$potate.setState('stop')
                break
            case 'd':
                if (this.walkDirection === 'left') { return }
                this.walkDirection = null
                if (this.$potate.getState() === 'attack') { return }
                this.$potate.setState('stop')
                break
        }
    }

    function mouseDown(e) {
        if (e.button === 0) {
            this.$potate.setState('attack')
        }
    }

    function walkMove() {
        const state = this.$potate.getState()
        if (!this.walkDirection || state === 'attack' || state === 'ground') { return }
        if (this.direction === 'right' && this.x < this.stage.width - this.width) {
            this.x += this.speed
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
        }
    }

    function jumpMove() {
        const state = this.$potate.getState()
        if (state !== 'jump' && state !== 'fall') { return }
        this.y -= this.vSpeed
        if (this.vSpeed > -4) {
            this.vSpeed -= 0.5
            if (this.vSpeed === 0) {
                this.$potate.setState('fall')
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