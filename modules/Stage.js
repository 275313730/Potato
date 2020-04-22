class Stage {
    constructor(options) {
        options = options || {}
        Stage.width = options.width || Game.width
        Stage.height = options.height || Game.height
        this.unit = this.unit()
        this.events = options.events
    }

    // 创建Stage
    create(fn) {
        fn.call(this)
        // 设置页面宽高
        Game.canvas.setAttribute('width', Stage.width + 'px')
        Game.canvas.setAttribute('height', Stage.height + 'px')

        this.timer = setInterval(() => {
            if (this.refresh()) {
                this.executeEvents()
                this.draw()
            }
        }, 1000 / Game.frames)
        return this
    }

    unit() {
        let units = {}

        // 添加单位
        function add(unit) {
            units[unit.id] = unit
        }

        // 删除单位
        function del(id) {
            unBindUserEvent(units[id])
            delete units[id]
        }

        // 查找单位
        function find(id) {
            return units[id]
        }

        // 删除所有单位
        function delAll() {
            travel(unit => {
                del(unit.id)
            })
        }

        // 遍历单位
        function travel(fn) {
            for (const key in units) {
                fn(units[key])
            }
        }

        // 解绑单位事件
        function unBindUserEvent(unit, eventType) {
            let userEvents = unit.userEvents
            if (!unit.userEvents) { return }
            if (eventType) {
                for (let i = 0; i < userEvents.length; i++) {
                    let event = userEvents[i]
                    if (event.eventType === eventType) {
                        window.removeEventListener(eventType, event.bindFn)
                        userEvents.splice(i, 1)
                        i--
                    }
                }
            } else {
                unit.userEvents.forEach(event => {
                    window.removeEventListener(event.eventType, event.bindFn)
                });
            }
        }

        return {
            add: add.bind(this),
            del: del.bind(this),
            delAll: delAll.bind(this),
            travel: travel.bind(this),
            find: find.bind(this),
            unBindUserEvent: unBindUserEvent.bind(this)
        }
    }

    // 执行事件
    executeEvents() {
        for (const key in this.events) {
            this.events[key].call(this)
        }
        this.unit.travel(unit => {
            const events = unit.events
            if (events) {
                events.forEach(event => {
                    event()
                });
            }
        })
    }

    // 绘制画面
    draw() {
        Game.ctx.clearRect(0, 0, this.width, this.height)
        this.unit.travel(unit => {
            unit.draw && unit.draw()
        })
    }

    // 页面刷新条件(设置页面刷新条件以减少绘制次数，可用于标题/物品栏等无动态界面)
    refresh() {
        return true
    }

    // 销毁
    destory() {
        clearInterval(this.timer)
        this.unit.delAll()
    }
}



