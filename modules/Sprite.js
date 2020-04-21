class Sprite {
    constructor(options) {

        this.check(options)

        // 初始化变量
        this.id = ''
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.stick = null
        this.direction = 6
        this.animations = null

        for (const key in options) {
            this[key] = options[key]
        }

        Sprite.units[options.id] = this
    }

    check(options) {
        if (!Sprite.units) {
            Sprite.units = {}
        }
        if (!options.id) {
            throw new Error('Sprite needs an id.')
        }
        if (Sprite.units.id) {
            throw new Error('Sprite exists.')
        }
    }

    create(fn) {
        fn.call(this)
        return this
    }

    bindDraw(fn) {
        this.draw = () => {
            fn.call(this)
        }
    }

    bindImage(name) {
        let img = Game.images[name],
            ctx = Game.ctx
        this.width = img.width
        this.height = img.height
        this.draw = () => {
            ctx.globalAlpha = this.alpha || 1
            if (this.direction === undefined || this.direction === 6) {
                ctx.drawImage(img, this.x, this.y)
            } else {
                // 水平翻转画布
                ctx.translate(this.stageWidth, 0);
                ctx.scale(-1, 1);
                // 绘制图片
                ctx.drawImage(img, Stage.width - img.width - this.x, this.y);
                // 画布恢复正常
                ctx.translate(this.stageWidth, 0);
                ctx.scale(-1, 1);
            }
        }
    }

    bindAnimation(name, time) {
        time = time || Sprite.AnimationInterval || 16
        let ctx = Game.ctx,
            index = 0,
            count = 0,
            images = this.animations[name]
        this.draw = () => {
            ctx.globalAlpha = this.alpha || 1
            let relX, relY
            if (this.stick) {
                relX = this.x + this.stick.x
                relY = this.y + this.stick.y
            } else {
                relX = this.x
                relY = this.y
            }
            if (this.direction === 6 || this.direction === undefined) {
                ctx.drawImage(images[index], relX, relY)
            } else {
                // 水平翻转画布
                ctx.translate(Stage.width, 0);
                ctx.scale(-1, 1);
                // 绘制图片
                ctx.drawImage(images[index], Stage.width - images[index].width - relX, relY);
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
    }

    bindEvent(fn) {
        this.events = this.events || []
        this.events.push(fn.bind(this))
    }

    bindUserEvent(fn, eventType) {
        this.keys = this.keys || []
        const bindFn = function (e) {
            fn.call(this, e)
        }.bind(this)
        window.addEventListener(eventType, bindFn)
        this.keys.push({ type: eventType, bindFn })
    }

    static find(id) {
        return Sprite.units[id]
    }

    static delete(id) {
        Sprite.units[id].unBindKeys()
        delete Sprite.units[id]
    }

    unBindKeys() {
        if (!this.keys) { return }
        this.keys.forEach(key => {
            window.removeEventListener(key.type, key.bindFn)
        });
    }
}