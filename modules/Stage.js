class Stage {
    constructor(options, fn) {
        this.canvas = document.getElementById(options.el);
        this.ctx = this.canvas.getContext('2d');
        this.width = options.width
        this.height = options.height
        Stage.player = options.player
        Stage.events = options.events

        this.init()
        fn()
    }

    init() {
        // 设置页面宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        // 初始化Canvas
        Canvas.init()
        Canvas.ctx = this.ctx
        Canvas.width = this.width
        Canvas.height = this.height
        Canvas.bgColor = 'rgb(150,200,150)'

        // 设置玩家初始属性
        Stage.player.direction = 'd'
        Stage.player.y = this.height
        Stage.player.v = 0
        Stage.player.score = 0

        // 监听键盘事件
        KeyBoard.keyListen()

        // 游戏循环
        this.loop()
    }

    // 游戏循环
    loop() {
        // 绘制初始页面
        Canvas.draw()

        // 定时刷新页面
        this.timer = setInterval(() => {
            if (Stage.player.moving || Stage.player.jumping) {
                Engine.run()
                this.executeEvents()
                Canvas.draw()
            }
        }, 16)
    }

    // 执行事件
    executeEvents() {
        for (const key in Stage.events) {
            Stage.events[key]()
        }
    }
}

Stage.events = {}

