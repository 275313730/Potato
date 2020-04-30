"use strict"
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
        this.alpha = 1
        this.size = 1

        // direction 决定图片的左右位置
        this.direction = 'right'

        // layer 决定图片上下关系
        this.layer = 0

        // diasabled 为true时无法执行精灵事件和用户事件
        this.disabled = false

        // fixed
        // 为0时随镜头移动
        // 为1时固定在页面上，不会随镜头移动
        // 在0~1之间会出现分层移动效果
        this.fixed = 0

        // Game的宽高(只读)
        Object.defineProperty(this, 'game', {
            value: {
                width: Game.width,
                height: Game.height
            }
        })

        // 设置实例数据
        for (const key in options) {
            this[key] = options[key]
        }

        delete this.setProperty
    }

    // 绘制
    draw() {
        // 执行函数
        let executor = null
        // 绘制图片
        let drawImage = (image) => {
            const context = Game.context

            // 图片方向
            if (this.direction === 'right') {
                context.drawImage(image, 0, 0, image.width, image.height, this.relX, this.y, image.width * this.size, image.height * this.size)
            } else {
                const tranlateX = Game.width - this.width - this.relX
                context.drawFlip(Game.width, () => {
                    // 绘制图片的数据要用图片属性
                    // 因为粒子精灵是无宽度和高度的，绘制出来的图片它与自身宽高和精灵的size有关
                    context.drawImage(image, 0, 0, image.width, image.height, tranlateX, this.y, image.width * this.size, image.height * this.size)
                })
            }
        }
        // 绘制动画
        let drawAnimation = (image, options) => {
            const context = Game.context

            // 图片方向
            if (!options.flip && this.direction === 'right' || options.flip && this.direction === 'left') {
                context.drawImage(image, options.currFrame * this.width, 0, this.width, this.height, this.relX, this.y, this.width * this.size, this.height * this.size)
            } else {
                const tranlateX = Game.width - this.width * this.size - this.relX
                // 水平翻转绘制
                context.drawFlip(Game.width, () => {
                    // 动画绘制的数据要用精灵属性
                    // 因为动画是由图片裁剪出来的，只与精灵自身宽高有关，跟图片无关
                    context.drawImage(image, options.currFrame * this.width, 0, this.width, this.height, tranlateX, this.y, this.width * this.size, this.height * this.size)
                })
            }
        }

        // 初始化方法
        return Object.defineProperties({}, {
            // 形状(canvas绘制)
            'shape': {
                value: callback => {
                    executor = () => callback.call(this, Game.context)
                }
            },
            // 图片
            'image': {
                value: (name, size = 1) => {
                    // 获取图片数据
                    let image = Game.image.get(name)

                    // 设置精灵尺寸
                    this.width = image.width
                    this.height = image.height

                    // 绘制函数
                    executor = () => {
                        drawImage(image, this.width * size, this.height * size)

                        // 测试
                        Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                    }
                }
            },
            // 粒子
            'particle': {
                value: (name, interval = 60, alphaRange, sizeRange) => {
                    let image = Game.image.get(name)

                    // 设置精灵尺寸(粒子精灵没有宽度和高度)
                    Object.defineProperties(this, {
                        'width': {
                            value: 0
                        },
                        'height': {
                            value: 0
                        }
                    })

                    // 设置粒子属性
                    let nextAlpha, nextSize, virtualWidth, virtualHeight

                    // 检查粒子是否有透明度变化
                    if (alphaRange != null) {
                        nextAlpha = (alphaRange[1] - alphaRange[0]) / interval
                    }

                    // 检查粒子是否有尺寸变化
                    if (sizeRange != null) {
                        nextSize = (sizeRange[1] - sizeRange[0]) / interval
                        this.size = sizeRange[1]
                    } else {
                        virtualWidth = image.width * this.size
                        virtualHeight = image.height * this.size
                    }

                    executor = () => {
                        // 透明度变化
                        if (nextAlpha != null) {
                            if (this.alpha + nextAlpha <= alphaRange[0] || this.alpha + nextAlpha >= alphaRange[1]) {
                                nextAlpha = -nextAlpha
                            }
                            this.alpha += nextAlpha
                        }

                        // 尺寸变化
                        if (nextSize != null) {
                            if (this.size + nextSize <= sizeRange[0] || this.size + nextSize >= sizeRange[1]) {
                                nextSize = - nextSize
                            }
                            this.size += nextSize
                        }

                        drawImage(image)

                        // 测试
                        Game.test && Game.context.test(this.relX, this.y, this.width, this.height)

                    }
                }
            },
            // 动画
            'animation': {
                value: (id, name, interval) => {
                    // 获取动画数据
                    const animation = Game.animation.get(id, name)

                    // 设置精灵尺寸
                    this.width = animation.width
                    this.height = animation.image.height

                    // 只读属性
                    let playing = true,
                        currInterval = 0,
                        currFrame = 0

                    // 动画属性
                    let options = Object.defineProperties({}, {
                        // 总动画帧
                        'animationFrames': {
                            value: animation.image.width / animation.width - 1
                        },
                        // 当前动画帧
                        'currFrame': {
                            get() {
                                return currFrame
                            }
                        },
                        // 动画间隔帧
                        'animationInterval': {
                            value: interval || animation.interval || Game.animationInterval
                        },
                        // 当前间隔帧
                        'currInterval': {
                            get() {
                                return currInterval
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
                        // 是否翻转
                        'flip': {
                            value: animation.flip
                        },
                        // 动画状态
                        'playing': {
                            get() {
                                return playing
                            }
                        },
                        // 完成时
                        'onComplete': {
                            value: null,
                            writable: true
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
                                this.currInterval = 0
                            }
                        },
                        // 停止
                        'stop': {
                            value: () => {
                                playing = false
                                this.currFrame = 0
                                this.currInterval = 0
                            }
                        }
                    })

                    // 绘制函数
                    executor = () => {
                        // 绘制动画
                        drawAnimation(animation.image, options)

                        // 测试 
                        Game.test && Game.context.test(this.relX, this.y, this.width, this.height)

                        // 暂停/停止
                        if (!playing) { return }

                        // 动画间隔帧增加
                        currInterval++

                        // 判断计数是否小于间隔帧数
                        if (currInterval >= options.animationInterval) {
                            // 动画当前间隔帧归零
                            currInterval = 0

                            // 动画关键帧增加
                            currFrame++

                            // 判断是否播放完成
                            if (currFrame >= options.animationFrames) {
                                // 动画重置
                                currFrame = 0

                                // 动画完成时执行函数
                                options.onComplete && options.onComplete()
                            }
                        }
                    }

                    // 返回数据
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
                    Game.context.globalAlpha = this.alpha
                    if (executor) {
                        executor()
                    } else {
                        // 测试
                        executor = () => Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                    }
                }
            }
        })
    }

    // 事件
    event() {
        let events = {}

        // 初始化方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: func => {
                    // 判断事件是否存在
                    if (events[func.name]) {
                        throw new Error(`Event '${func.name}' exists.`)
                    }
                    // 添加事件
                    events[func.name] = func
                }
            },
            // 删除
            'del': {
                value: name => {
                    // 判断事件是否存在
                    if (!events[name]) {
                        throw new Error(`Event ${func.name} doesn't exist.`)
                    }
                    // 删除事件
                    delete events[name]
                }
            },
            // 删除所有
            'delAll': {
                value: () => {
                    events = {}
                },
            },
            // 执行
            'execute': {
                value: () => {
                    // disabled时禁用事件
                    if (this.disabled) { return }
                    for (const key in events) {
                        events[key].call(this)
                    }
                }
            }
        })
    }

    // 用户事件
    userEvent() {
        let userEvents = {}
        function bindFunction(func, isBreak) {
            return e => {
                // 没有加入到场景前禁用
                if (!this.stage) { return }

                // disabled时禁用
                if (this.disabled) { return }

                // 按键间隔检测
                if (isBreak && e.type === 'keydown') {
                    if (Game.key === e.key) {
                        return
                    } else {
                        Game.key = e.key
                    }
                }

                // 执行事件
                func.call(this, e.key)
            }
        }

        // 初始化方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (func, eventType, isBreak) => {
                    // 判断用户事件是否存在
                    if (userEvents[eventType]) {
                        throw new Error(`UserEvent '${eventType}' exists.`)
                    }

                    // 添加事件到userEvents中
                    userEvents[eventType] = bindFunction.call(this, func, isBreak)

                    // 监听事件
                    window.addEventListener(eventType, userEvents[eventType])
                }
            },
            // 一次
            'once': {
                value: (func, eventType) => {
                    // 监听事件
                    window.addEventListener(eventType, bindFunction.call(this, func), { once: true })
                }
            },
            // 删除
            'del': {
                value: eventType => {
                    // 没有传参视为无效
                    if (!eventType) {
                        throw new Error(`This function need an eventType`)
                    }

                    // 判断用户事件是否存在
                    if (!userEvents[eventType]) {
                        throw new Error(`UserEvent ${eventType} doesn't exist.`)
                    }

                    // 解除监听
                    window.removeEventListener(eventType, events[eventType])
                }
            },
            // 删除所有
            'delAll': {
                value: () => {
                    // 解绑用户事件
                    for (const key in userEvents) {
                        window.removeEventListener(key, userEvents[key])
                    }

                    // 清空用户事件
                    userEvents = {}
                }
            }
        });
    }
}