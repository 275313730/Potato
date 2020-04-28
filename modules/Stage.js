import { Game } from "./Game.js";

export class Stage {
    constructor(options, callback) {
        // 初始化实例
        this.init(options)

        // 设置数据
        this.id = options.id
        this.width = options.width || Game.width
        this.height = options.height || Game.height

        // 执行回调函数
        callback && callback.call(this)

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
            movement: null
        },
            // 创建镜头移动
            createMovement = (perX, perY, frames, callback) => {
                if (camera.x < 0) {
                    camera.x = 0
                }
                if (camera.x > this.width - Game.width) {
                    camera.x = this.width - Game.width
                }
                let count = 0
                this.sprite.travel(sprite => {
                    sprite.disabled = true
                })
                camera.movement = () => {
                    count++
                    camera.x += perX
                    camera.y += perY
                    if (count > frames || (camera.x < 0 || camera.x > this.width - Game.width)) {
                        camera.movement = null
                        this.sprite.travel(sprite => {
                            sprite.disabled = false
                        })
                        callback && callback()
                    }
                }
            },
            // 计算镜头位置
            cal = () => {
                if (camera.follow) {
                    if (camera.follow.x < Game.width / 2) {
                        camera.x = 0
                    } else if (camera.follow.x > this.width - Game.width / 2) {
                        camera.x = this.width - Game.width
                    } else {
                        camera.x = camera.follow.x - Game.width / 2
                    }
                }
                camera.movement && camera.movement()
            }

        // 初始化方法
        return Object.defineProperties({}, {
            // 跟随
            'follow': {
                value: sprite => {
                    camera.follow = sprite
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
                value: (x, y, time, callback) => {
                    this.camera.unFollow()
                    time = time || 0
                    let frames = time / 1000 * Game.frames,
                        perX = x / frames,
                        perY = y / frames
                    createMovement(perX, perY, frames, callback)
                }
            },
            // 移动到
            'moveTo': {
                value: (sprite, time, callback) => {
                    this.camera.unFollow()
                    time = time || 0
                    let frames = time / 1000 * Game.frames,
                        perX = (sprite.x - camera.x) / frames,
                        perY = (sprite.y - camera.y) / frames
                    createMovement(perX, perY, frames, callback)
                }
            },
            // 获取镜头
            'get': {
                value: () => {
                    cal()
                    return Object.assign({}, camera)
                },
            }
        })
    }

    // 场景精灵
    sprite() {
        let sprites = {},
            layers = [],
            // 排序
            sort = () => {
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

        // 初始化方法
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
                    sort()
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
                value: callback => {
                    for (const key in sprites) {
                        if (callback(sprites[key]) === false) {
                            return
                        }
                    }
                }
            },
        })
    }

    // 场景事件
    event() {
        let events = {}

        // 初始化方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (func, ...args) => {
                    if (events[func.name]) {
                        throw new Error(`Event '${func.name}' exists.`)
                    }
                    events[func.name] = func.bind(this, ...args)
                }
            },
            // 单次
            'once': {
                value: (func, ...args) => {
                    if (events[func.name]) {
                        throw new Error(`Event '${func.name}' exists.`)
                    }
                    events[func.name] = () => {
                        func.call(this, ...args)
                        delete events[func.name]
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
                value: callback => {
                    for (const key in events) {
                        callback(events[key])
                    }
                }
            }
        })
    }

    // 场景函数
    execute() {
        // 初始化方法
        return Object.defineProperties({}, {
            // 刷新
            'refresh': {
                value: () => {
                    Game.context.clearRect(0, 0, Game.width, Game.height)

                    // 获取镜头数据
                    let camera = this.camera.get()

                    // 执行场景事件
                    this.event.travel(event => {
                        event.call(this)
                    })

                    // 场景精灵渲染和事件
                    this.sprite.travel(sprite => {
                        // 计算相对位置
                        sprite.relX = sprite.x - camera.x * (1 - sprite.fixed)
                        sprite.relY = sprite.y - camera.y * (1 - sprite.fixed)

                        // 绘制画面
                        sprite.draw.execute()

                        // 执行事件
                        sprite.event.execute()
                    })

                    // 全局精灵渲染和事件
                    Game.sprite.travel(sprite => {
                        sprite.draw.execute()
                        sprite.event.execute()
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