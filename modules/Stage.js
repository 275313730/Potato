import { Game } from "./Game.js";

export class Stage {
    constructor(options, fn) {
        // 检测参数
        this.check(options)

        // 设置数据
        this.id = options.id
        this.width = options.width || Game.width
        this.height = options.height || Game.height

        // 初始化方法
        this.camera = this.camera()
        this.unit = this.unit()
        this.event = this.event()
        this.execute = this.execute()
        fn && fn.call(this)

        // 进入循环
        this.timer = setInterval(() => {
            this.execute.refresh()
        }, 1000 / Game.frames)
    }

    // 检测参数
    check(options) {
        if (options.id == null) {
            throw new Error(`Stage need an id.`)
        }
    }

    // 镜头
    camera() {
        let camera = {
            x: 0,
            y: 0,
            follow: null,
            moving: null
        }
        return {
            // 跟随
            follow: unit => {
                camera.follow = unit
            },
            // 解除跟随
            unFollow: () => {
                camera.follow = null
            },
            // 移动
            move: (x, y, times, fn) => {
                this.camera.unFollow()
                let count = 0
                camera.moving = () => {
                    count++
                    camera.x += x
                    camera.y += y
                    if (count > times) {
                        camera.moving = null
                        fn()
                    }
                }
            },
            // 计算并返回数据
            cal: () => {
                if (camera.follow) {
                    if (camera.follow.x < Game.width / 2) {
                        camera.x = 0
                    } else if (camera.follow.x > this.width - Game.width / 2) {
                        camera.x = this.width - Game.width
                    } else {
                        camera.x = camera.follow.x - Game.width / 2
                    }
                } else {
                    camera.moving && camera.moving()
                }
                return camera
            }
        }
    }

    // 场景单位
    unit() {
        let units = {},
            layers = []
        return {
            // 添加
            add: newUnit => {
                // 检测单位id是否存在
                for (const key in units) {
                    if (key === newUnit.id) {
                        throw new Error(`Unit exists.`)
                    }
                }

                // 给单位添加场景的宽高值
                newUnit.stage = {
                    width: this.width,
                    height: this.height
                }

                // 加入场景单位
                units[newUnit.id] = newUnit

                // 如果图层值不在layers中则新增图层值并排序layers
                if (layers.indexOf(newUnit.layer) === -1) {
                    layers.push(newUnit.layer)
                    layers.sort()
                }

                // 单位排序
                this.unit.sort()
            },
            // 删除
            del: id => {
                if (units[id]) {
                    units[id].userEvent.delAll()
                    delete units[id]
                }
            },
            // 查找
            find: id => {
                return units[id]
            },
            // 删除所有
            delAll: () => {
                for (const key in units) {
                    this.unit.del(key)
                }
            },
            // 遍历
            travel: fn => {
                for (const key in units) {
                    if (fn(units[key]) === false) {
                        return
                    }
                }
            },
            // 排序
            sort: () => {
                let newUnits = {}
                // 根据图层值排序
                layers.forEach(layer => {
                    for (const key in units) {
                        const unit = units[key]
                        if (unit.layer === layer) {
                            newUnits[unit.id] = unit
                            delete units[key]
                        }
                    }
                })
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
                    throw new Error(`Event '${fn.name}' exists.`)
                }
                events[fn.name] = fn.bind(this, ...args)
            },
            // 删除
            del: name => {
                if (!events[name]) {
                    throw new Error(`Event '${name}' doesn't exist.`)
                }
                delete events[name]
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
            // 刷新
            refresh: () => {
                Game.ctx.clearRect(0, 0, Game.width, Game.height)
                // 获取镜头数据
                let camera = this.camera.cal()
                // 单位渲染和事件
                this.unit.travel(unit => {
                    // 计算单位相对位置
                    unit.relX = unit.x - camera.x * (1 - unit.fixed)
                    unit.relY = unit.y - camera.y * (1 - unit.fixed)

                    // 绘制画面
                    unit.draw.execute()
                    // 禁用状态下不能执行事件
                    if (unit.disabled === false) {
                        // 执行单位事件
                        unit.event.execute()
                    }
                })
                // 执行场景事件
                this.event.travel(event => {
                    event.call(this)
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