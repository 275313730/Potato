import { Game } from "./Game.js";
import { Stage } from "../modules/Stage.js";

export class Sprite {
    constructor(options, fn) {
        this.check(options)
        this.setDefalutProperty()
        this.setProperty(options)
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
            throw new Error('Width must be greater than 0')
        }
        if (options.height && options.height < 0) {
            throw new Error('Height must be greater than 0')
        }
        // 检查方向
        if (options.direction) {
            switch (options.direction) {
                case 2:
                    break
                case  4:
                    break
                case 6:
                    break
                case 8:
                    break
                default:
                    throw new Error(`Direnction isn't correct.`)
            }
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
        this.direction = 6
        this.animations = null
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
                    fn.call(this, Game.ctx)
                }
            },
            // 绑定图片
            image: name => {
                let img = Game.images[name],
                    ctx = Game.ctx
                this.width = img.width
                this.height = img.height
                drawFunction = () => {
                    ctx.globalAlpha = this.alpha || 1
                    if (this.direction === undefined || this.direction === 6) {
                        ctx.drawImage(img, this.relX, this.y)
                    } else {
                        // 水平翻转画布
                        ctx.translate(Stage.width, 0);
                        ctx.scale(-1, 1);
                        // 绘制图片
                        ctx.drawImage(img, Stage.width - img.width - this.relX, this.y);
                        // 画布恢复正常
                        ctx.translate(Stage.width, 0);
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
                    images = this.animations[name]
                drawFunction = () => {
                    ctx.globalAlpha = this.alpha || 1
                    if (this.direction === 6 || this.direction === undefined) {
                        ctx.drawImage(images[index], this.relX, this.y)
                    } else {
                        // 水平翻转画布
                        ctx.translate(Stage.width, 0);
                        ctx.scale(-1, 1);
                        // 绘制图片
                        ctx.drawImage(images[index], Stage.width - images[index].width - this.relX, this.y);
                        // 画布恢复正常
                        ctx.translate(Stage.width, 0);
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
                    if (isBreak && e.key === Game.key) { return }
                    Game.key = e.key
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
}