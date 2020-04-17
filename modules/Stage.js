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
                    if (this.player.x - this.player.width <= 0) { return true }
                    this.direction = e.key
                    this.player.x -= this.player.speed
                    break
                case 'd':
                    if (this.player.x + this.player.width >= this.width) { return true }
                    this.direction = e.key
                    this.player.x += this.player.speed
                    break
                case ' ':
                    this.jump(this.timer)
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

    /*
        Gravity Module
    */

    // 跳跃
    jump() {
        if (this.player.y > 0) {
            return
        }
        this.player.v = speed
    }
}
