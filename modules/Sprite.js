import { Game } from "./Game.js";

export class Sprite {
    constructor(options, callback) {
        // 初始化实例
        this.init(options)

        // 设置参数
        this.setProperty(options)

        // 执行回调函数
        callback && callback.call(this)
    }

    // 初始化实例
    init(options) {
        // 检查id是否填写
        if (options.id == null) {
            throw new Error('Sprite needs an id.')
        }
        // 检查width和height
        if (options.width && options.width < 0) {
            throw new Error(`Sprite's width must be greater than 0`)
        }
        if (options.height && options.height < 0) {
            throw new Error(`Sprite's height must be greater than 0`)
        }
        // 检查方向
        if (options.direction && options.direction !== 'right' && options.direction !== 'left') {
            throw new Error(`Direction isn't correct.`)
        }

        // 初始化实例方法
        Object.defineProperties(this, {
            'draw': {
                value: this.draw()
            },
            'event': {
                value: this.event()
            },
            'userEvent': {
                value: this.userEvent()
            }
        })

        delete this.init
    }

    // 设置参数
    setProperty(options) {
        // 设置初始参数
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0

        // layer 决定图片上下关系
        this.layer = 0

        // diasabled 为true时无法执行单位事件和用户事件
        this.disabled = false

        // fixed
        // 为0时随镜头移动
        // 为1时固定在页面上，不会随镜头移动
        // 在0~1之间会出现分层移动效果
        this.fixed = 0

        // direction 决定图片的左右位置
        this.direction = 'right'

        // Game的宽高(只读)
        Object.defineProperty(this, 'game', {
            value: {
                width: Game.width,
                height: Game.height
            }
        })

        for (const key in options) {
            this[key] = options[key]
        }

        delete this.setProperty
    }

    // 绘制
    draw() {
        let executor = null,
            // 设置尺寸
            setSize = img => {
                this.width = img.width
                this.height = img.height
            },
            // 绘制图片
            drawImage = image => {
                const context = Game.context

                // 图片透明度
                context.globalAlpha = this.alpha || 1

                // 图片方向
                if (this.direction === 'right') {
                    context.drawImage(image, this.relX, this.y)
                } else {
                    const tranlateX = Game.width - this.width - this.relX
                    // 水平翻转绘制
                    context.flip(Game.width, () => {
                        // 绘制图片
                        context.drawImage(image, tranlateX, this.y)
                    })
                }
            },
            // 绘制动画
            drawAnimation = options => {
                const context = Game.context

                // 图片透明度
                context.globalAlpha = this.alpha || 1

                // 图片方向
                if (!options.flip && this.direction === 'right' || options.flip && this.direction === 'left') {
                    context.drawImage(options.image, options.currFrame * this.width, 0, this.width, this.height, this.relX, this.y, this.width, this.height)
                } else {
                    const tranlateX = Game.width - options.width - this.relX
                    // 水平翻转绘制
                    context.drawFlip(Game.width, () => {
                        // 绘制图片
                        context.drawImage(options.image, options.currFrame * this.width, 0, this.width, this.height, tranlateX, this.y, this.width, this.height)
                    })
                }
            }

        // 初始化方法
        return Object.defineProperties({}, {
            // 绑定形状(canvas绘制)
            'shape': {
                value: callback => {
                    executor = () => callback.call(this, Game.context)
                }
            },
            // 绑定图片
            'image': {
                value: name => {
                    let image = Game.image.get(name)
                    setSize(image)
                    executor = () => {
                        drawImage(image)

                        // 测试
                        Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                    }
                }
            },
            // 绑定动画
            'animation': {
                value: (id, name, interval) => {
                    let options = {
                        // 当前关键帧
                        currFrame: 0,
                        // 完成时执行函数
                        onComplete: null
                    },
                        // 只读数据 
                        playing = true,
                        count = 0,
                        role = Game.animation.get(id, name)

                    this.width = role.width
                    this.height = role.image.height

                    Object.defineProperties(options, {
                        // 动画间隔帧
                        'interval': {
                            value: interval || role.interval || Game.animationInterval
                        },
                        // 图片
                        'image': {
                            value: role.image
                        },
                        // 翻转
                        'flip': {
                            value: role.flip
                        },
                        // 动画状态
                        'playing': {
                            get() {
                                return playing
                            }
                        },
                        // 当前间隔帧
                        'count': {
                            get() {
                                return count
                            }
                        },
                        // 动画帧宽度
                        'width': {
                            value: this.width
                        },
                        // 动画帧高度
                        'height': {
                            value: this.height
                        },
                        // 播放
                        'play': {
                            value: () => {
                                playing = true
                            }
                        },
                        // 暂停
                        'pause': {
                            value: () => {
                                playing = false
                                count = 0
                            }
                        },
                        // 停止
                        'stop': {
                            value: () => {
                                playing = false
                                this.currFrame = 0
                                count = 0
                            }
                        }
                    })

                    executor = () => {
                        drawAnimation(options)

                        // 测试 
                        Game.test && Game.context.test(this.relX, this.y, this.width, this.height)

                        // 暂停/停止
                        if (!options.playing) { return }
                        count++

                        // 计数>=间隔帧数时切换图片并归零计数
                        if (count >= options.interval) {
                            count = 0
                            if (options.currFrame < role.image.width / role.width - 1) {
                                options.currFrame++
                            } else {
                                options.currFrame = 0
                                options.onComplete && options.onComplete()
                            }
                        }
                    }

                    return options
                }
            },
            // 取消绑定
            'unBind': {
                value: () => {
                    executor = null
                }
            },
            // 执行
            'execute': {
                value: () => {
                    executor && executor()
                }
            }
        })
    }

    // 事件
    event() {
        let events = []

        // 初始化方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: callback => {
                    events.push(callback)
                }
            },
            // 删除
            'del': {
                value: name => {
                    for (const key in events) {
                        if (events[key].name === name) {
                            events.splice(key, 1)
                            return
                        }
                    }
                }
            },
            // 删除所有
            'delAll': {
                value: () => {
                    events = []
                },
            },
            // 执行
            'execute': {
                value: () => {
                    // disabled时禁用
                    if (this.disabled) { return }
                    events.forEach(event => {
                        event.call(this)
                    })
                }
            }
        })
    }

    // 用户事件
    userEvent() {
        let userEvents = []

        // 初始化方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (func, eventType, isBreak) => {
                    const bindFn = e => {
                        // 没有加入到场景前禁用
                        if (!this.stage) { return }
                        // disabled时禁用
                        if (this.disabled) { return }

                        // 按键间隔检测
                        if (isBreak) {
                            if (e.key === Game.key) {
                                return
                            }
                            Game.key = e.key
                        }

                        // 键盘松开时Game.key为null
                        if (eventType === 'keyup') {
                            Game.key = null
                        }

                        // 执行事件
                        func.call(this, e)
                    }
                    // 监听事件
                    window.addEventListener(eventType, bindFn)

                    // 添加事件到userEvents中
                    userEvents.push({ eventType, bindFn })
                }
            },
            // 删除
            'del': {
                value: eventType => {
                    // 没有传参视为无效
                    if (!eventType) { return }

                    // 解除监听
                    for (let i = 0; i < userEvents.length; i++) {
                        const event = userEvents[i]
                        if (event.eventType === eventType) {
                            window.removeEventListener(eventType, event.bindFn)
                            userEvents.splice(i, 1)
                            i--
                        }
                    }
                }
            },
            // 删除所有
            'delAll': {
                value: () => {
                    userEvents.forEach(event => {
                        window.removeEventListener(event.eventType, event.bindFn)
                    });
                    userEvents = []
                }
            }
        });
    }
}