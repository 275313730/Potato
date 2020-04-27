import { Game } from "./Game.js";

export class Stage {
    constructor(options, fn) {
        // 初始化实例
        this.init(options)

        // 设置数据
        this.id = options.id
        this.width = options.width || Game.width
        this.height = options.height || Game.height

        // 执行回调函数
        fn && fn.call(this)

        // 进入循环
        this.timer = setInterval(() => {
            this.execute.refresh()
        }, 1000 / Game.frames)
    }

    // 初始化实例
    init(options) {
        if (options.id == null) {
            throw new Error(`Stage need an id.`)
        }

        // 初始化实例方法
        Object.defineProperties(this, {
            'camera': {
                value: this.camera()
            },
            'sprite': {
                value: this.sprite()
            },
            'event': {
                value: this.event()
            },
            'execute': {
                value: this.execute()
            }
        })

        delete this.init
    }

    // 镜头
    camera() {
        let camera = {
            x: 0,
            y: 0,
            follow: null,
            moveMent: null
        },
            createMoveMent = (perX, perY, frames, fn) => {
                if (camera.x < 0) {
                    camera.x = 0
                }
                if (camera.x > this.width - Game.width) {
                    camera.x = this.width - Game.width
                }
                let count = 0
                camera.moveMent = () => {
                    count++
                    camera.x += perX
                    camera.y += perY
                    if (count > frames || (camera.x < 0 || camera.x > this.width - Game.width)) {
                        camera.moveMent = null
                        fn && fn()
                    }
                }
            }

        // 初始化镜头方法
        return Object.defineProperties({}, {
            // 跟随
            'follow': {
                value: (unit) => {
                    camera.follow = unit
                }
            },
            // 解除跟随
            'unFollow': {
                value: () => {
                    camera.follow = null
                }
            },
            // 移动
            'move': {
                value: (x, y, time, fn) => {
                    this.camera.unFollow()
                    let frames = time / 1000 * Game.frames,
                        perX = x / frames,
                        perY = y / frames
                    createMoveMent(perX, perY, frames, fn)
                }
            },
            // 移动到
            'moveTo': {
                value: (unit, time, fn) => {
                    this.camera.unFollow()
                    camera.moving = true
                    let frames = time / 1000 * Game.frames,
                        perX = (unit.x - camera.x) / frames,
                        perY = (unit.y - camera.y) / frames
                    createMoveMent(perX, perY, frames, fn)
                }
            },
            // 计算并返回数据
            'cal': {
                value: () => {
                    if (camera.follow) {
                        if (camera.follow.x < Game.width / 2) {
                            camera.x = 0
                        } else if (camera.follow.x > this.width - Game.width / 2) {
                            camera.x = this.width - Game.width
                        } else {
                            camera.x = camera.follow.x - Game.width / 2
                        }
                    }
                    camera.moveMent && camera.moveMent()

                    return camera
                }
            }
        })
    }

    // 场景单位
    sprite() {
        let sprites = {},
            layers = []

        // 初始化单位方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: newSprite => {
                    // 检测单位id是否存在
                    for (const key in sprites) {
                        if (key === newSprite.id) {
                            throw new Error(`Unit exists.`)
                        }
                    }

                    // 给单位添加场景的宽高值(只读)
                    Object.defineProperty(newSprite, 'stage', {
                        value: {
                            width: this.width,
                            height: this.height
                        }
                    })

                    // 加入场景单位
                    sprites[newSprite.id] = newSprite

                    // 如果图层值不在layers中则新增图层值并排序layers
                    if (layers.indexOf(newSprite.layer) === -1) {
                        layers.push(newSprite.layer)
                        layers.sort()
                    }

                    // 单位排序
                    this.sprite.sort()
                }
            },
            // 删除
            'del': {
                value: id => {
                    if (sprites[id]) {
                        sprites[id].userEvent.delAll()
                        delete sprites[id]
                    }
                }
            },
            // 查找
            'find': {
                value: id => {
                    return sprites[id]
                }
            },
            // 删除所有
            'delAll': {
                value: () => {
                    for (const key in sprites) {
                        this.sprite.del(key)
                    }
                }
            },
            // 遍历
            'travel': {
                value: fn => {
                    for (const key in sprites) {
                        if (fn(sprites[key]) === false) {
                            return
                        }
                    }
                }
            },
            // 排序
            'sort': {
                value: () => {
                    let newSprites = {}
                    // 根据图层值排序
                    layers.forEach(layer => {
                        for (const key in sprites) {
                            const sprite = sprites[key]
                            if (sprite.layer === layer) {
                                newSprites[sprite.id] = sprite
                                delete sprites[key]
                            }
                        }
                    })
                    sprites = newSprites
                }
            }
        })
    }

    // 场景事件
    event() {
        let events = {}

        // 初始化事件方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (fn, ...args) => {
                    if (events[fn.name]) {
                        throw new Error(`Event '${fn.name}' exists.`)
                    }
                    events[fn.name] = fn.bind(this, ...args)
                }
            },
            'once': {
                value: (fn, ...args) => {
                    if (events[fn.name]) {
                        throw new Error(`Event '${fn.name}' exists.`)
                    }
                    events[fn.name] = () => {
                        fn.call(this, ...args)
                        delete events[fn.name]
                    }
                }
            },
            // 删除
            'del': {
                value: name => {
                    if (!events[name]) {
                        throw new Error(`Event '${name}' doesn't exist.`)
                    }
                    delete events[name]
                }
            },
            // 遍历
            'travel': {
                value: fn => {
                    for (const key in events) {
                        fn(events[key])
                    }
                }
            }
        })
    }

    // 场景函数
    execute() {
        // 初始化场景函数方法
        return Object.defineProperties({}, {
            // 刷新
            'refresh': {
                value: () => {
                    Game.ctx.clearRect(0, 0, Game.width, Game.height)

                    // 获取镜头数据
                    let camera = this.camera.cal()

                    // 执行场景事件
                    this.event.travel(event => {
                        event.call(this)
                    })

                    // 单位渲染和事件
                    this.sprite.travel(unit => {
                        // 计算单位相对位置
                        unit.relX = unit.x - camera.x * (1 - unit.fixed)
                        unit.relY = unit.y - camera.y * (1 - unit.fixed)

                        // 绘制画面
                        unit.draw.execute()

                        // 执行单位事件
                        unit.event.execute()
                    })
                }
            },
            // 销毁
            'destory': {
                value: () => {
                    clearInterval(this.timer)
                    this.sprite.delAll()
                }
            }
        })
    }
}