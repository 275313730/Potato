import { Game } from "./Game.js";

export class Sprite {
    constructor(options, fn) {
        // 设置参数
        this.check(options)
        this.setDefalutProperty()
        this.setProperty(options)

        // 初始化方法
        this.draw = this.draw()
        this.event = this.event()
        this.userEvent = this.userEvent()
        fn && fn.call(this)
    }

    // 检查
    check(options) {
        // 检查id是否填写
        if (!options.id) {
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
    }

    // 初始化数据
    setDefalutProperty() {
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0

        // layer
        // layer决定图片上下关系
        this.layer = 0

        // diasabled
        // disabled为true时无法执行单位事件和用户事件
        this.disabled = false

        // fixed
        // fixed=0时随镜头移动
        // fixed=1时固定在页面上，不会随镜头移动
        // fixed在0~1之间会出现分层移动效果
        this.fixed = 0

        // direction 
        // direction决定图片的左右位置
        this.direction = 'right'

        this.game = {
            width: Game.width,
            height: Game.height
        }
    }

    // 设置数据
    setProperty(options) {
        for (const key in options) {
            this[key] = options[key]
        }
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
            drawImage = img => {
                const ctx = Game.ctx

                // 图片透明度
                ctx.globalAlpha = this.alpha || 1

                // 图片方向
                if (this.direction === 'right') {
                    ctx.drawImage(img, this.relX, this.y)
                } else {
                    const tranlateX = Game.width - img.width - this.relX
                    // 水平翻转画布
                    ctx.translate(Game.width, 0);
                    ctx.scale(-1, 1);
                    // 绘制图片
                    ctx.drawImage(img, tranlateX, this.y);
                    // 画布恢复正常
                    ctx.translate(Game.width, 0);
                    ctx.scale(-1, 1);
                }
            }
        return {
            // 绑定形状(canvas绘制)
            shape: fn => {
                executor = () => fn.call(this, Game.ctx)
            },
            // 绑定图片
            image: name => {
                let img = Game.image.get(name)
                setSize(img)
                executor = () => {
                    drawImage(img)
                }
            },
            // 绑定动画
            animation: (id, name, interval) => {
                // 动画间隔帧书
                interval = interval || Game.animationInterval
                let index = 0,
                    count = 0,
                    images = Game.animation.get(id, name)
                setSize(images[0])
                executor = () => {
                    drawImage(images[index])
                    count++
                    // 计数>=间隔帧数时切换图片并归零计数
                    if (count >= interval) {
                        count = 0
                        index < images.length - 1 ? index++ : index = 0
                    }
                }
            },
            // 取消绑定
            unBind: () => {
                executor = null
            },
            // 执行
            execute: () => {
                executor && executor()
            }
        }
    }

    // 事件
    event() {
        let events = []
        return {
            // 添加
            add: fn => {
                events.push(fn)
            },
            // 删除
            del: fn => {
                for (const key in events) {
                    events[key] === fn
                    events.splice(key, 1)
                    return
                }
            },
            // 删除所有
            delAll: () => {
                events = []
            },
            // 执行
            execute: () => {
                events.forEach(event => {
                    event.call(this)
                })
            }
        }
    }

    // 用户事件
    userEvent() {
        let userEvents = []
        return {
            // 添加
            add: (fn, eventType, isBreak) => {
                const bindFn = e => {
                    // disabled时禁用用户事件
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
                    fn.call(this, e)
                }
                // 监听事件
                window.addEventListener(eventType, bindFn)

                // 添加事件到userEvents中
                userEvents.push({ eventType, bindFn })
            },
            // 删除
            del: eventType => {
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
            },
            // 删除所有
            delAll: () => {
                userEvents.forEach(event => {
                    window.removeEventListener(event.eventType, event.bindFn)
                });
                userEvents = []
            }
        }
    }
}