class Stage {
    constructor(options) {
        Stage.width = this.width = options.width || Game.width
        Stage.height = this.height = options.height || Game.height
        Stage.events = this.events = options.events
        this.units = {}
        return this
    }

    // 初始设置
    set(fn) {
        fn.call(this)
        this.draw()
        return this
    }

    // 创建单位
    createUnit(unit) {
        this.units[unit.id] = unit
        return this
    }

    // 创建Stage
    create() {
        // 设置页面宽高
        Game.canvas.setAttribute('width', Stage.width + 'px')
        Game.canvas.setAttribute('height', Stage.height + 'px')

        this.timer = setInterval(() => {
            if (this.refresh()) {
                this.executeEvents()
                this.draw()
            }
        }, 16)

        return this
    }

    // 执行事件
    executeEvents() {
        for (const id in Sprite.units) {
            Sprite.units[id].event && Sprite.units[id].event()
        }
    }

    // 绘制页面
    draw() {
        Game.ctx.clearRect(0, 0, Stage.width, Stage.height)
        for (const key in Sprite.units) {
            if (!Sprite.units[key].draw) { continue }
            Sprite.units[key].draw()
        }
    }

    // 页面刷新条件(设置页面刷新条件以减少绘制次数，可用于标题/物品栏等无动态界面)
    refresh() {
        return true
    }

    // 摧毁
    destory() {
        for (const key in this.units) {
            Sprite.delete(this.units[key].id)
        }
    }
}



