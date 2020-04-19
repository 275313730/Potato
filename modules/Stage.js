class Stage {
    constructor(options) {
        Stage.canvas = this.canvas = document.getElementById(options.el);
        Stage.ctx = this.ctx = this.canvas.getContext('2d');
        Stage.width = this.width = options.width
        Stage.height = this.height = options.height
        Stage.events = options.events

        // 设置页面宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        // 创建新进程
        this.create()

        return this
    }

    // 创建新进程
    create() {
        this.timer = setInterval(() => {
            if (this.refresh()) {
                this.executeEvents()
                this.draw()
            }
        }, 16)
    }

    // 初始设置
    init(fn) {
        fn.call(this)
        this.draw()
    }

    // 执行事件
    executeEvents() {
        for (const id in Sprite.units) {
            Sprite.units[id].event && Sprite.units[id].event()
        }
    }

    // 绘制页面
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        for (const key in Sprite.units) {
            if (!Sprite.units[key].draw) { continue }
            let unit = JSON.parse(JSON.stringify(Sprite.units[key]))
            if (unit.sticky) {
                unit.x += unit.sticky.x
                unit.y += unit.sticky.y
            }
            Sprite.units[key].draw.call(unit)
        }
    }

    refresh() {
        return true
    }
}



