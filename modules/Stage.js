class Stage {
    constructor(options) {
        this.canvas = document.getElementById(options.el);
        this.ctx = this.canvas.getContext('2d');
        this.width = options.width
        this.height = options.height

        this.player = options.player

        this.direction = 'd'

        this.units = options.units

        this.init()
    }

    init() {
        // 设置页面宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        // 设置玩家属性
        this.player.y = this.height - this.player.height
        this.player.v = 0

        // 刷新页面
        this.refreshCanvas()

        // 监听键盘事件
        this.keyListen()
    }


    /*
        KeyBoard Module
    */

    // 监听键盘事件
    keyListen() {
        window.addEventListener('keydown', function (e) {
            switch (e.key) {
                case 'a':
                    if (this.player.x - this.player.width <= 0 && this.direction === e.key) {
                        return true
                    }
                    this.direction = e.key
                    this.moving = true
                    break
                case 'd':
                    if (this.player.x + this.player.width >= this.width && this.direction === e.key) {
                        return true
                    }
                    this.direction = e.key
                    this.moving = true
                    break
                case ' ':
                    this.jump()
                    break
            }
        }.bind(this))
        window.addEventListener('keyup', function (e) {
            switch (e.key) {
                case 'a':
                    if (this.direction === 'd') { return }
                    this.moving = false
                    break
                case 'd':
                    if (this.direction === 'a') { return }
                    this.moving = false
                    break
            }
        }.bind(this))
    }

    /*
        Canvas Module
    */

    // 定时刷新页面
    refreshCanvas() {
        this.timer = setInterval(() => {
            this.draw()
        }, 17)
    }

    // 页面绘制
    draw() {
        this.clear()
        this.drawBackground()
        this.physicsEngine()
        this.drawPlayer()
    }

    // 清除页面
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    // 绘制轮廓
    drawBackground() {
        this.ctx.fillStyle = 'rgb(150,200,150)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 绘制玩家
    drawPlayer() {
        this.ctx.fillStyle = this.player.color
        this.ctx.beginPath();
        switch (this.direction) {
            case 'a':
                this.ctx.moveTo(this.player.x - this.player.width, this.player.y + this.player.height / 2);
                break
            case 'd':
                this.ctx.moveTo(this.player.x + this.player.width, this.player.y + this.player.height / 2);
                break
        }
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height)
        this.ctx.lineTo(this.player.x, this.player.y)
        this.ctx.fill();
    }

    drawDialog() {
        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(this.width / 4, this.height / 2, this.width / 2, this.height / 3)
    }

    drawText() {
        this.ctx.font = "48px serif";
        this.ctx.strokeText("Hello world", this.width / 3, this.height / 1.5);
    }

    /*
        Physics Engine Module
    */

    physicsEngine() {
        this.jumping && this.gravity()
        this.moving && this.move()
    }

    gravity() {
        this.player.y -= this.player.v
        if (this.player.y + this.player.height < this.height) {
            this.player.v -= 2
        } else {
            this.player.v = 0
            this.player.y = this.height - this.player.height
            this.jumping = false
        }
    }

    // 跳跃
    jump() {
        if (this.jumping) {
            return
        }
        this.jumping = true
        this.player.v = 20
    }

    move() {
        if (this.direction === 'd' && this.player.x + this.player.width < this.width) {
            this.player.x += this.player.speed
            return
        }
        if (this.direction === 'a' && this.player.x - this.player.width > 0) {
            this.player.x -= this.player.speed
            return
        }
        this.moving = false
    }
}
