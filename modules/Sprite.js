"use strict"
import { Game } from "./Game.js";

export class Sprite {
    constructor(options) {
        // 设置参数
        this.setProperty(options)

        // 检查id是否填写
        if (this.id == null) {
            throw new Error('Sprite needs an id.')
        }
        // 检查width和height
        if (this.width && this.width < 0) {
            throw new Error(`Sprite's width must be greater than 0`)
        }
        if (this.height && this.height < 0) {
            throw new Error(`Sprite's height must be greater than 0`)
        }
        // 检查方向
        if (this.direction && this.direction !== 'right' && this.direction !== 'left') {
            throw new Error(`Direction isn't correct.`)
        }

        // 初始化实例方法
        this.draw = this.draw()
        this.event = this.event()
        this.userEvent = this.userEvent()

        // 创建实例
        options.created.call(this)
    }

    // 设置参数
    setProperty(options) {
        const config = options.config

        // 设置初始参数
        this.id = config.id
        this.x = config.x || 0
        this.y = config.y || 0
        this.width = config.width || 0
        this.height = config.height || 0
        this.offsetLeft = config.offsetLeft || 0
        this.offsetTop = config.offsetTop || 0

        // alpha 决定绘制透明度
        this.alpha = config.alpha || 1

        // scale 决定实际绘制尺寸
        this.scale = config.scale || 1

        // direction 决定图片的左右位置
        this.direction = config.direction || 'right'

        // layer 决定图片上下关系
        this.layer = config.layer || 0

        // diasabled 为true时无法执行精灵事件和用户事件
        this.disabled = config.disabled || false

        // fixed
        // 为0时随镜头移动
        // 为1时固定在页面上，不会随镜头移动
        // 在0~1之间会出现分层移动效果
        this.fixed = config.fixed || 0

        // Game的宽高(只读)
        Object.defineProperty(this, 'game', {
            value: {
                width: Game.width,
                height: Game.height
            }
        })

        let data = options.data || {}
        let methods = options.methods || {}

        // 设置实例数据
        for (const key in data) {
            this[key] = data[key]
        }

        // 设置实例方法
        for (const key in methods) {
            this[key] = methods[key]
        }

        delete this.setProperty
    }

    // 绘制
    draw() {
        // 执行函数
        let executor = null
        // 绘制图片
        let drawImage = image => {
            const context = Game.context
            const relX = this.relX
            const y = this.y
            const offsetLeft = this.offsetLeft
            const offsetTop = this.offsetTop
            const width = image.width
            const height = image.height
            const scale = this.scale

            // 图片方向
            if (this.direction === 'right') {
                context.drawImage(image, 0, 0, width, height, relX + offsetLeft, y + offsetTop, width * scale, height * scale)
            } else {
                const tranlateX = Game.width - this.width - relX
                context.drawFlip(Game.width, () => {
                    // 绘制图片的数据要用图片属性
                    // 因为粒子精灵是无宽度和高度的，绘制出来的图片它与自身宽高和精灵的scale有关
                    context.drawImage(image, 0, 0, width, height, tranlateX + offsetLeft, y + offsetTop, width * scale, height * scale)
                })
            }
        }
        // 绘制动画
        let drawAnimation = (image, options) => {
            // 获取绘制数据
            const context = Game.context
            const relX = this.relX
            const y = this.y
            const offsetLeft = this.offsetLeft
            const offsetTop = this.offsetTop
            const width = options.width
            const height = options.height
            const scale = this.scale
            const direction = this.direction
            const currFrame = options.currFrame

            // 图片方向
            if (!options.flip && direction === 'right' || options.flip && direction === 'left') {
                context.drawImage(image, currFrame * width, 0, width, height, relX + offsetLeft, y + offsetTop, width * scale, height * scale)
            } else {
                const tranlateX = Game.width - this.width * scale - relX
                // 水平翻转绘制
                context.drawFlip(Game.width, () => {
                    // 动画绘制的数据要用精灵属性
                    // 因为动画是由图片裁剪出来的，只与精灵自身宽高有关，跟图片无关
                    context.drawImage(image, currFrame * width, 0, width, height, tranlateX + offsetLeft, y + offsetTop, width * scale, height * scale)
                })
            }
        }

        // 初始化方法
        return {
            // 形状(canvas绘制)
            shape: callback => {
                executor = () => callback.call(this, Game.context)
            },
            // 图片
            image: name => {
                // 获取图片数据
                let image = Game.image.get(name)

                // 绘制函数
                executor = () => {
                    drawImage(image)

                    // 测试
                    Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                }

            },
            // 粒子
            particle: (name, interval = 60, alphaRange, scaleRange) => {
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
                let nextAlpha, nextscale, virtualWidth, virtualHeight

                // 检查粒子是否有透明度变化
                if (alphaRange != null) {
                    nextAlpha = (alphaRange[1] - alphaRange[0]) / interval
                }

                // 检查粒子是否有尺寸变化
                if (scaleRange != null) {
                    nextscale = (scaleRange[1] - scaleRange[0]) / interval
                    this.scale = scaleRange[1]
                } else {
                    virtualWidth = image.width * this.scale
                    virtualHeight = image.height * this.scale
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
                    if (nextscale != null) {
                        if (this.scale + nextscale <= scaleRange[0] || this.scale + nextscale >= scaleRange[1]) {
                            nextscale = - nextscale
                        }
                        this.scale += nextscale
                    }

                    drawImage(image)

                    // 测试
                    Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                }
            },
            // 动画
            animation: (id, name, interval) => {
                // 获取动画数据
                const animation = Game.animation.get(id, name)

                // 只读属性
                let playing = true,
                    currInterval = 0,
                    currFrame = 0

                // 动画属性
                let options = Object.defineProperties({}, {
                    // 总动画帧
                    'animationFrames': {
                        value: (animation.image.width / animation.width) - 1
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
                        value: animation.width
                    },
                    // 动画帧高度
                    'height': {
                        value: animation.image.height
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
            },
            // 取消绑定
            unBind: () => {
                executor = null
            },
            // 执行
            execute: () => {
                Game.context.globalAlpha = this.alpha
                if (executor) {
                    executor()
                } else {
                    // 测试
                    executor = () => Game.test && Game.context.test(this.relX, this.y, this.width, this.height)
                }
            }
        }
    }

    // 事件
    event() {
        let events = {}

        // 初始化方法
        return {
            // 添加
            add: func => {
                // 判断事件是否存在
                if (events[func.name]) {
                    throw new Error(`Event '${func.name}' exists.`)
                }
                // 添加事件
                events[func.name] = func
            },
            // 删除
            del: name => {
                // 判断事件是否存在
                if (!events[name]) {
                    throw new Error(`Event ${func.name} doesn't exist.`)
                }
                // 删除事件
                delete events[name]
            },
            // 删除所有
            delAll: () => {
                events = {}
            },
            // 执行
            execute: () => {
                // disabled时禁用事件
                if (this.disabled) { return }
                for (const key in events) {
                    events[key].call(this)
                }
            }
        }
    }

    // 用户事件
    userEvent() {
        let userEvents = {}

        function bindFunction(callback, eventType, isBreak) {
            return e => {
                // 没有加入到场景前禁用
                if (!this.stage) { return }

                // disabled时禁用
                if (this.disabled) { return }

                // 按键间隔检测
                if (isBreak) {
                    if (e.type === 'keydown') {
                        if (Game.key === e.key) {
                            return
                        } else {
                            Game.key = e.key
                        }
                    }

                    if (e.type === 'mousedown') {
                        if (Game.mouseDown === true) {
                            return
                        } else {
                            Game.mouseDown = true
                        }
                    }
                }

                // 判断事件类型
                // 鼠标事件
                if (eventType === 'click' || eventType.indexOf('mouse') > -1) {
                    const canvas = Game.canvas

                    // 计算画面缩放比例
                    const scale = canvas.clientHeight / Game.height

                    // 计
                    const mouse = {
                        x: (e.clientX - canvas.offsetLeft) / scale,
                        y: (e.clientY - canvas.offsetTop) / scale
                    }
                    callback.call(this, mouse)
                    return
                }

                // 键盘事件
                if (eventType.indexOf('key') > -1) {
                    callback.call(this, e.key)
                }
            }
        }

        // 初始化方法
        return {
            // 添加
            add: (callback, eventType, isBreak) => {
                // 判断用户事件是否存在
                if (userEvents[eventType]) {
                    throw new Error(`UserEvent '${eventType}' exists.`)
                }

                // 添加事件到userEvents中
                userEvents[eventType] = bindFunction.call(this, callback, eventType, isBreak)

                // 监听事件
                window.addEventListener(eventType, userEvents[eventType])
            },
            // 一次
            once: (func, eventType) => {
                // 监听事件
                window.addEventListener(eventType, bindFunction.call(this, func), { once: true })
            },
            // 删除
            del: eventType => {
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
            },
            // 删除所有
            delAll: () => {
                // 解绑用户事件
                for (const key in userEvents) {
                    window.removeEventListener(key, userEvents[key])
                }

                // 清空用户事件
                userEvents = {}
            }
        };
    }
}