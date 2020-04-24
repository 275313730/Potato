import { Game } from "./Game.js";

export class Sprite {
    constructor(options, fn) {
        // 设置参数
        this.check(options)
        this.setDefalutProperty()
        this.setProperty(options)

        // 初始化Sprite方法
        this.draw = this.draw()
        this.event = this.event()
        this.userEvent = this.userEvent()
        fn && fn.call(this)
    }

    // 检查options
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
        this.depth = 0
        this.direction = 'right'
        this.game = {
            width: Game.width,
            height: Game.height
        }
    }

    // 设置数据
    setProperty(options) {
        for (const key in options) {
            switch (key) {
                case 'create':
                    continue
                case 'setProperty':
                    continue
            }
            this[key] = options[key]
        }
        if (this.stick) {
            this.relX = this.x + this.stick.x
        } else {
            this.relX = this.x
        }
    }

    // 绘制
    draw() {
        let executor = function () { },
            setSize = img => {
                this.width = img.width
                this.height = img.height
            },
            drawImage = img => {
                const ctx = Game.ctx
                // 锚点位移
                const translateY = Game.anchor * (Game.height - this.height) - this.y
                ctx.globalAlpha = this.alpha || 1
                if (this.direction === undefined || this.direction === 'right') {
                    ctx.drawImage(img, this.relX, translateY)
                } else {
                    // 水平翻转画布
                    ctx.translate(Game.width, 0);
                    ctx.scale(-1, 1);
                    // 绘制图片
                    ctx.drawImage(img, Game.width - img.width - this.relX, translateY);
                    // 画布恢复正常
                    ctx.translate(Game.width, 0);
                    ctx.scale(-1, 1);
                }
            }
        return {
            // 绑定形状(几何图形)
            shape: fn => {
                const translateY = Game.anchor * (Game.height - this.height) - this.y
                executor = () => fn.call(this, Game.ctx, translateY)
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
            animation: (name, interval) => {
                // 动画间隔帧
                interval = interval || Game.AnimationInterval
                let index = 0,
                    count = 0,
                    images = Game.animation.get(this.id, name)
                setSize(images[0])
                executor = () => {
                    drawImage(images[index])
                    if (count < interval) {
                        count++
                    } else {
                        count = 0
                        index < images.length - 1 ? index++ : index = 0
                    }
                }
            },
            unBind: () => {
                executor = function () { }
            },
            execute: () => {
                executor()
            }
        }
    }

    // 事件
    event() {
        let events = []
        return {
            add: fn => {
                events.push(fn)
            },
            del: fn => {
                for (const key in events) {
                    events[key] === fn
                    events.splice(key, 1)
                    return
                }
            },
            delAll: () => {
                events = []
            },
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
            add: (fn, eventType, isBreak) => {
                const bindFn = e => {
                    if (this.disabled) { return }
                    if (isBreak && e.key !== Game.key) {
                        Game.key = e.key
                    }
                    if (eventType === 'keyup') {
                        Game.key = null
                    }
                    fn.call(this, e)
                }
                window.addEventListener(eventType, bindFn)
                userEvents.push({ eventType, bindFn })
            },
            del: eventType => {
                if (!eventType) { return }
                userEvents.delete('eventType', eventType, event => {
                    window.removeEventListener(eventType, event.bindFn)
                })
            },
            delAll: () => {
                userEvents.forEach(event => {
                    window.removeEventListener(event.eventType, event.bindFn)
                });
                userEvents = []
            }
        }
    }
}