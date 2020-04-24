import { Game } from "./Game.js";

export class Stage {
    constructor(options, fn) {
        if (options.id == null) {
            throw new Error(`Stage need an id.`)
        }
        if (!Stage.states) {
            Stage.states = {}
        }
        // 设置数据
        this.id = options.id
        this.alive = options.alive

        // 初始化场景方法
        this.unit = this.unit()
        this.event = this.event()
        this.execute = this.execute()
        fn && fn.call(this)

        // 进入场景循环
        this.timer = setInterval(() => {
            this.execute.draw()
            this.execute.events()
        }, 1000 / Game.frames)

        return this
    }

    // 场景单位
    unit() {
        let units = {}
        return {
            // 添加单位
            add: newUnit => {
                for (const key in units) {
                    if (key === newUnit.id) {
                        return false
                    }
                }
                newUnit.stage = {
                    width: Game.width,
                    height: Game.height
                }
                units[newUnit.id] = newUnit
                return true
            },
            // 删除单位
            del: id => {
                if (units[id]) {
                    units[id].userEvent.delAll()
                    delete units[id]
                }
            },
            // 查找单位
            find: id => {
                return units[id]
            },
            // 删除所有单位
            delAll: () => {
                for (const key in units) {
                    this.unit.del(key)
                }
            },
            // 遍历单位
            travel: fn => {
                for (const key in units) {
                    fn(units[key])
                }
            }
        }
    }

    // 场景事件
    event() {
        let events = {}
        return {
            // 添加
            add: (fn, ...args) => {
                if (events[fn.name]) {
                    return false
                }
                events[fn.name] = fn.bind(this, ...args)
                return true
            },
            // 删除
            del: name => {
                if (!events[name]) {
                    return false
                }
                delete events[name]
                return true
            },
            // 遍历
            travel: fn => {
                for (const key in events) {
                    fn(events[key])
                }
            }
        }
    }

    // 场景自调用函数
    execute() {
        return {
            // 事件(包括场景事件和单位事件)
            events: () => {
                this.event.travel(event => {
                    event.call(this)
                })
                this.unit.travel(unit => {
                    unit.event.execute()
                })
            },
            // 单位绘制
            draw: () => {
                // 清除画面
                Game.ctx.clearRect(0, 0, Game.width, Game.height)
                this.unit.travel(unit => {
                    // 计算单位真实位置
                    unit.relX = unit.stick ? unit.x + unit.stick.x : unit.x
                    // 绘制画面
                    unit.draw.execute()
                })
            },
            // 场景销毁
            destory: () => {
                if (this.alive) {
                    Stage.states[this.id] = {}
                    this.unit.travel(unit => {
                        Stage.states[this.id][unit.id] = unit
                    })
                }
                clearInterval(this.timer)
                this.unit.delAll()
            }
        }
    }
}