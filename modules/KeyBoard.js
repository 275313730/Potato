class KeyBoard {
    // 监听键盘事件
    static keyListen(player) {
        window.addEventListener('keydown', function (e) {
            this.bindKeyDown.call(Stage.player, e.key)
        }.bind(this))

        window.addEventListener('keyup', function (e) {
            this.bindKeyUp.call(Stage.player, e.key)
        }.bind(this))
    }

    // 绑定键盘按下事件
    static bindKeyDown(key) {
        switch (key) {
            case 'a':
                if (this.x - this.width <= 0 && this.direction === key) {
                    return
                }
                this.direction = key
                this.moving = true
                break
            case 'd':
                if (this.x + this.width >= this.width && this.direction === key) {
                    return
                }
                this.direction = key
                this.moving = true
                break
            case ' ':
                if (this.jumping) {
                    return
                }
                this.v = 15
                this.jumping = true
                break
        }
    }

    // 绑定键盘松开事件
    static bindKeyUp(key) {
        switch (key) {
            case 'a':
                if (this.direction === 'd') { return }
                this.moving = false
                break
            case 'd':
                if (this.direction === 'a') { return }
                this.moving = false
                break
        }
    }
}