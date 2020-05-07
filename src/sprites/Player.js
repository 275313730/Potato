export function player() {
    return {
        config: {
            id: 'kingHuman',
            x: 20,
            y: 50,
            direction: 'right',
            layer: 2,
        },
        data: {
            speed: 1,
            space: false,
            walking: false,
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
            this.event.add(walk)
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