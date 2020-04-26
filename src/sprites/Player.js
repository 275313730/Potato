import { Sprite } from "../../modules/Sprite.js";

export function player(x) {
    const options = {
        // Sprite属性
        id: 'player',
        x,
        width: 40,
        direction: x === 10 ? 'right' : 'left',
        layer: 1,

        // 自定义属性和事件
        shoot: false,
        speed: 2,
        space: false,
        walking: false,
        move,
        stop
    }

    function keyDown(e) {
        switch (e.key) {
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

    function keyUp(e) {
        switch (e.key) {
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

    function move(direction) {
        this.direction = direction
        this.draw.animation(this.id, 'walk')
        this.walking = true
    }

    function stop() {
        this.draw.animation(this.id, 'idle')
        this.walking = false
    }

    function walk() {
        if (this.walking === false) { return }
        if (this.direction === 'right') {
            this.x += this.speed
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
        }
    }

    return new Sprite(options, function () {
        this.userEvent.add(keyDown, 'keydown', true)
        this.userEvent.add(keyUp, 'keyup')
        this.event.add(walk)
        this.draw.animation(this.id, 'idle')
        this.y = this.game.height - this.height
    })
}