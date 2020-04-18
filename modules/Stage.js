class Stage {
    constructor(options) {
        this.canvas = document.getElementById(options.el);
        this.ctx = this.canvas.getContext('2d');
        this.width = options.width
        this.height = options.height
        Stage.player = this.player = options.player

        this.init()
    }

    init() {
        // 设置页面宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        Canvas.ctx = this.ctx
        Canvas.width = this.width
        Canvas.height = this.height
        Canvas.bgColor = 'rgb(150,200,150)'

        // 设置玩家属性
        this.player.direction = 'd'
        this.player.y = this.height
        this.player.v = 0
        this.player.score = 0

        // 监听键盘事件
        KeyBoard.keyListen()

        // 游戏循环
        this.loop()
    }

    // 游戏循环
    loop() {
        // 创建星星对象
        Event.createStar()

        // 绘制初始页面
        Canvas.draw()

        // 定时刷新页面
        this.timer = setInterval(() => {
            if (this.player.moving || this.player.jumping) {
                PyhsicsEngine.run()
                Event.play()
                Canvas.draw()
            }
        }, 16)
    }
}

