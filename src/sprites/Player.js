import { Sprite } from "../../modules/Sprite.js";

export function player(stick, sw, sh, animations, x) {
    const options = {
        // Sprite属性
        id: 'player',
        x,
        y: sh - 48,
        height: 48,
        width: 40,
        direction: x === 10 ? 6 : 4,
        stick,
        animations,

        // 自定义属性和事件
        isAdd: false,
        shoot: false,
        speed: 2,
        walking: false,
        space: false,
        move,
        stop
    }

    function keyDown(e) {
        switch (e.key) {
            case 'ArrowRight':
                this.move(6)
                break
            case 'ArrowLeft':
                this.move(4)
                break
            case ' ':
                this.space = true
                break
            case 'Escape':
                this.isAdd = true
                break
            case 'z':
                this.shoot = true
                break
        }
    }

    function keyUp(e) {
        switch (e.key) {
            case 'ArrowRight':
                if (this.direction === 4) { return }
                this.stop()
                break
            case 'ArrowLeft':
                if (this.direction === 6) { return }
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
        switch (this.direction) {
            case 6:
                // 玩家实际位置移动
                if (this.x < this.stick.width) {
                    this.x += this.speed
                    // 移动背景使得玩家相对位置不变
                    if (this.relX > sw / 2 - 10 && this.x < this.stick.width - sw / 2) {
                        this.stick.x -= this.speed
                    }
                }
                break
            case 4:
                if (this.x > 0) {
                    this.x -= this.speed
                    if (this.relX < sw / 2 - 10 && this.stick.x < 0) {
                        this.stick.x += this.speed
                    }
                }
                break
        }
    }

    return new Sprite(options, function () {
        this.userEvent.add(keyDown, 'keydown')
        this.userEvent.add(keyUp, 'keyup')
        this.event.add(walk)
        this.draw.animation('stay')
    })
}