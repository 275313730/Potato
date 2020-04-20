class Stage {
    constructor(options) {
        Stage.width = options.width || Game.width
        Stage.height = options.height || Game.height
        this.events = options.events
        this.id = options.id
        this.units = {}
    }

    // 初始设置
    set(fn) {
        fn.call(this)
        this.draw()
        return this
    }

    // 播放音乐
    switchMusic(name) {
        this.music = Game.audio[name]
        this.music.loop = true
        this.music.play()
        return this
    }

    // 加载单位
    loadUnit(unit) {
        this.units[unit.id] = unit
        return this
    }

    // 查找单位
    findUnit(id) {
        return this.units[id]
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
        for (const key in this.events) {
            this.events[key].call(this)
        }
        for (const id in Sprite.units) {
            const events = Sprite.units[id].events
            if (events) {
                events.forEach(event => {
                    event()
                });
            }
        }
    }

    // 绘制页面
    draw() {
        Game.ctx.clearRect(0, 0, this.width, this.height)
        for (const key in Sprite.units) {
            Sprite.units[key].draw && Sprite.units[key].draw()
        }
    }

    // 页面刷新条件(设置页面刷新条件以减少绘制次数，可用于标题/物品栏等无动态界面)
    refresh() {
        return true
    }

    // 摧毁
    destory() {
        clearInterval(this.timer)
        this.music.stop()
        for (const key in this.units) {
            Sprite.delete(this.units[key].id)
        }
    }
}



