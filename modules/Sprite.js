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
        this.id = ''
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.stick = null
        this.direction = 'right'
        this.animations = null
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
        let drawFunction = function () { }
        return {
            // 绑定形状(几何图形)
            shape: fn => {
                drawFunction = () => {
                    const translateY = Game.flipVertical ? Game.height - this.y - this.height : this.y
                    fn.call(this, Game.ctx, translateY)
                }
            },
            // 绑定图片
            image: name => {
                let img = Game.image.get(name),
                    ctx = Game.ctx
                this.width = img.width
                this.height = img.height
                drawFunction = () => {
                    // 垂直翻转
                    const translateY = Game.flipVertical ? Game.height - this.y - this.height : this.y
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
            },
            // 绑定动画
            animation: (name, time) => {
                // 动画间隔帧
                time = time || Game.AnimationInterval || 16
                let ctx = Game.ctx,
                    index = 0,
                    count = 0,
                    images = Game.animation.get(this.id, name)
                this.width = images[0].width
                this.height = images[0].height
                drawFunction = () => {
                    // 垂直翻转
                    const translateY = Game.flipVertical ? Game.height - this.y - this.height : this.y

                    ctx.globalAlpha = this.alpha || 1

                    if (this.direction === undefined || this.direction === 'right') {
                        ctx.drawImage(images[index], this.relX, translateY)
                    } else {
                        // 水平翻转画布
                        ctx.translate(Game.width, 0);
                        ctx.scale(-1, 1);
                        // 绘制图片
                        ctx.drawImage(images[index], Game.width - images[index].width - this.relX, translateY);
                        // 画布恢复正常
                        ctx.translate(Game.width, 0);
                        ctx.scale(-1, 1);
                    }
                    count++
                    if (count === time) {
                        count = 0
                        index++
                        if (index === images.length) {
                            index = 0
                        }
                    }
                }
            },
            unBind: () => {
                drawFunction = function () { }
            },
            execute: () => {
                drawFunction()
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
                    if (isBreak) {
                        if (e.key === Game.key) { return }
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
                for (let i = 0; i < userEvents.length; i++) {
                    let event = userEvents[i]
                    if (event.eventType === eventType) {
                        window.removeEventListener(eventType, event.bindFn)
                        userEvents.splice(i, 1)
                        i--
                    }

                }
            },
            delAll: () => {
                userEvents.forEach(event => {
                    window.removeEventListener(event.eventType, event.bindFn)
                });
            }
        }
    }

    // 状态
    state() {
        let states = {}
        return {
            set: (key, value) => {
                states[key] = value
            },
            get: key => {
                return states[key]
            }
        }
    }
}