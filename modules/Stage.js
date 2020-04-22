class Stage {
    constructor(options, fn) {
        Stage.width = options.width || Game.width
        Stage.height = options.height || Game.height

        this.events = options.events
        this.unit = this.unit()
        this.execute = this.execute()
        fn && fn.call(this)
        // 设置页面宽高
        Game.canvas.setAttribute('width', Stage.width + 'px')
        Game.canvas.setAttribute('height', Stage.height + 'px')

        this.timer = setInterval(() => {
            this.execute.events()
            this.execute.calPosition()
            this.execute.draw()
        }, 1000 / Game.frames)
        return this
    }

    unit() {
        let units = {}
        return {
            // 添加单位
            add: newUnit => {
                let exist = false
                this.unit.travel(unit => {
                    if (unit.id === newUnit.id) {
                        exist = true
                    }
                })
                if (!exist) {
                    units[newUnit.id] = newUnit
                }
            },
            // 删除单位
            del: id => {
                units[id].unBind.userEvent()
                delete units[id]
            },
            // 查找单位
            find: id => {
                return units[id]
            },
            // 删除所有单位
            delAll: () => {
                this.unit.travel(unit => {
                    this.unit.del(unit.id)
                })
            },
            // 遍历单位
            travel: fn => {
                for (const key in units) {
                    fn(units[key])
                }
            }
        }
    }

    // 执行函数
    execute() {
        return {
            // 事件
            events: () => {
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
            },
            // 画面
            draw: () => {
                Game.ctx.clearRect(0, 0, this.width, this.height)
                this.unit.travel(unit => {
                    unit.draw && unit.draw()
                })
            },
            // 计算真实位置
            calPosition: () => {
                this.unit.travel(unit => {
                    if (unit.stick) {
                        unit.relX = unit.x + unit.stick.x
                    } else {
                        unit.relX = unit.x
                    }
                })
            },
            // 销毁
            destory: () => {
                clearInterval(this.timer)
                this.unit.delAll()
            }
        }
    }
}



