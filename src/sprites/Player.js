import { Sprite } from "../../modules/Sprite.js";

export function player(x, stick) {
    const options = {
        // Sprite属性
        id: 'player',
        x,
        direction: x === 10 ? 'right' : 'left',
        depth: 1,
        stick,

        // 自定义属性和事件
        isAdd: false,
        shoot: false,
        gun: true,
        speed: 2,
        walking: false,
        space: false,
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
            case 'Escape':
                this.isAdd = true
                break
            case 'z':
                if (this.gun) {
                    this.shoot = true
                }
                break
            case 'x':
                this.gun = !this.gun
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
        }
    }

    function move(direction) {
        if (this.walking === true && this.direction === direction) {
            return
        }
        this.walking = true
        this.direction = direction
        this.draw.animation('walk')
    }

    function stop() {
        this.walking = false
        this.draw.animation('stay')
    }

    function walk() {
        if (!this.walking) { return }
        if (this.direction === 'right' && this.x < this.stick.width) {
            // 玩家实际位置移动
            this.x += this.speed
            // 移动背景使得玩家相对位置不变
            if (this.relX > this.game.width / 2 - 10 && this.x < this.stick.width - this.game.width / 2) {
                this.stick.x -= this.speed
            }
        } else if (this.direction === 'left' && this.x > 0) {
            this.x -= this.speed
            if (this.relX < this.game.width / 2 - 10 && this.stick.x < 0) {
                this.stick.x += this.speed
            }
        }
    }

    return new Sprite(options, function () {
        this.userEvent.add(keyDown, 'keydown', true)
        this.userEvent.add(keyUp, 'keyup')
        this.event.add(walk)
        this.draw.animation('stay')
    })
}