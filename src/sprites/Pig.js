export function pig(id, x, y) {
    return {
        config: {
            id,
            x,
            y,
            width: 19,
            height: 18,
            offsetLeft: -10,
            offsetTop: -10
        },
        data: {
            type: 'enemy',
            hp: 2,
            hitting: false,
            dead: false
        },
        methods: {
            stop() {
                this.graphics.animation('pig', 'idle')
            },
            hit() {
                if (this.hitting || this.hp === 0) { return }
                this.hitting = true
                this.hp--
                this.graphics.animation('pig', 'hit')
                    .onComplete = this.wait()
            },
            die() {
                this.graphics.animation('pig', 'dead')
                    .onComplete = () => {
                        this.dead = true
                    }
            },
            wait() {
                this.graphics.wait(16, () => {
                    this.hitting = false
                    if (this.hp === 0) {
                        this.die()
                    } else {
                        this.stop()
                    }
                })
            }
        },
        created() {
            this.stop()
        }
    }
}