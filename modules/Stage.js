import { Game } from "./Game.js";

export class Stage {
    constructor(options, fn) {
        // 检测参数
        this.check(options)

        // 设置数据
        this.id = options.id

        // 初始化场景方法
        this.unit = this.unit()
        this.event = this.event()
        this.execute = this.execute()
        fn && fn.call(this)

        // 进入场景循环
        this.timer = setInterval(() => {
            this.execute.refresh()
        }, 1000 / Game.frames)

        return this
    }

    // 检测参数
    check(options) {
        if (options.id == null) {
            throw new Error(`Stage need an id.`)
        }
    }

    // 场景单位
    unit() {
        let units = {}
        return {
            // 添加单位
            add: newUnit => {
                for (const key in units) {
                    if (key === newUnit.id) {
                        throw new Error(`Unit exists.`)
                    }
                }
                newUnit.stage = {
                    width: Game.width,
                    height: Game.height
                }
                units[newUnit.id] = newUnit
                this.unit.sort()
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
            },
            // 排序
            sort: () => {
                let newUnits = {}
                for (let i = 0; i < 10; i++) {
                    this.unit.travel(unit => {
                        if (unit.depth === i) {
                            newUnits[unit.id] = unit
                        }
                    })
                }
                units = newUnits
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

    // 场景函数
    execute() {
        return {
            // 刷新场景
            refresh: () => {
                Game.ctx.clearRect(0, 0, Game.width, Game.height)
                // 单位渲染和事件
                this.unit.travel(unit => {
                    // 计算单位真实位置
                    unit.relX = unit.stick ? unit.x + unit.stick.x : unit.x
                    // 绘制画面
                    unit.draw.execute()
                    // 禁用状态下不能执行事件
                    if (!unit.disabled) {
                        // 执行单位事件
                        unit.event.execute()
                    }
                })
                // 执行场景事件
                this.event.travel(event => {
                    event.call(this)
                })
            },
            // 销毁场景
            destory: () => {
                clearInterval(this.timer)
                this.unit.delAll()
            }
        }
    }
}