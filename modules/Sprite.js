class Sprite {
    constructor(options, fn) {
        this.check(options)
        this.setDefalutProperty()
        this.setProperty(options)
        this.bind = this.bind()
        this.unBind = this.unBind()
        fn && fn.call(this)
    }

    // 检查options
    check(options) {
        // 检查id是否填写
        if (!options.id) {
            throw new Error('Sprite needs an id.')
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

    // 销毁
    destroy() {
        Game.stage.get().unit.del(this.id)
    }

    // 绑定
    bind() {
        return {
            // 绑定形状(几何图形)
            shape: fn => {
                this.draw = () => {
                    fn.call(this)
                }
            },
            // 绑定图片
            image: name => {
                let img = Game.images[name],
                    ctx = Game.ctx
                this.width = img.width
                this.height = img.height
                this.draw = () => {
                    ctx.globalAlpha = this.alpha || 1
                    if (this.direction === undefined || this.direction === 6) {
                        ctx.drawImage(img, this.relX, this.y)
                    } else {
                        // 水平翻转画布
                        ctx.translate(this.stageWidth, 0);
                        ctx.scale(-1, 1);
                        // 绘制图片
                        ctx.drawImage(img, Stage.width - img.width - this.relX, this.y);
                        // 画布恢复正常
                        ctx.translate(this.stageWidth, 0);
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
                this.draw = () => {
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
            // 绑定事件
            event: fn => {
                this.events = this.events || []
                this.events.push(fn.bind(this))
            },
            // 绑定玩家事件(键盘事件or鼠标事件等)
            userEvent: (fn, eventType, isBreak) => {
                this.userEvents = this.userEvents || []
                const bindFn = function (e) {
                    if (isBreak && e.key === Game.key) { return }
                    Game.key = e.key
                    fn.call(this, e)
                }.bind(this)
                window.addEventListener(eventType, bindFn)
                this.userEvents.push({ eventType, bindFn })
            }
        }
    }

    // 解绑
    unBind() {
        return {
            // 解绑画面
            draw: () => {
                this.draw = null
            },
            // 解绑事件
            event: fn => {
                for (const key in this.events) {
                    this.events[key] === fn.bind(this)
                    this.events.splice(key, 1)
                    return
                }
            },
            // 解绑用户事件
            userEvent: eventType => {
                let userEvents = this.userEvents
                if (!this.userEvents) { return }
                if (eventType) {
                    for (let i = 0; i < userEvents.length; i++) {
                        let event = userEvents[i]
                        if (event.eventType === eventType) {
                            window.removeEventListener(eventType, event.bindFn)
                            userEvents.splice(i, 1)
                            i--
                        }
                    }
                } else {
                    this.userEvents.forEach(event => {
                        window.removeEventListener(event.eventType, event.bindFn)
                    });
                }
            }
        }
    }
}