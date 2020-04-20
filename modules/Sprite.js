class Sprite {
    constructor(options) {
        Sprite.units = Sprite.units || {}
        if (!options.id) {
            throw new Error('Sprite needs an id.')
        }
        if (Sprite.units.id) {
            throw new Error('Sprite exists.')
        }
        for (const key in options) {
            this[key] = options[key]
        }
        Sprite.units[options.id] = this
    }

    loadImage(url) {
        let img = new Image()
        img.onload = () => {
            const ctx = Game.ctx
            if (this.direction === undefined) {
                this.draw = () => {
                    ctx.globalAlpha = this.alpha || 1
                    ctx.drawImage(img, this.x, this.y)
                }
            } else {
                this.draw = () => {
                    ctx.globalAlpha = this.alpha || 1
                    if (this.direction === true) {
                        ctx.drawImage(img, this.x, this.y)
                    } else {
                        // 水平翻转画布
                        ctx.translate(this.stageWidth, 0);
                        ctx.scale(-1, 1);
                        // 绘制图片
                        ctx.drawImage(img, this.stageWidth - this.img.width - this.x, this.y);
                        // 画布恢复正常
                        ctx.translate(this.stageWidth, 0);
                        ctx.scale(-1, 1);
                    }
                }
            }
        }
        img.src = url
        return this
    }

    playAnimation(name, time) {
        let ctx = Game.ctx,
            index = 0,
            count = 0,
            images = this.animations[name]
        this.draw = () => {
            ctx.globalAlpha = this.alpha || 1
            if (this.direction === 'right') {
                ctx.drawImage(images[index], this.x, this.y)
            } else {
                // 水平翻转画布
                ctx.translate(Stage.width, 0);
                ctx.scale(-1, 1);
                // 绘制图片
                ctx.drawImage(images[index], Stage.width - images[index].width - this.x, this.y);
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
        return this
    }

    stick(sticky) {
        this.sticky = Sprite.find(sticky)
        return this
    }

    bindEvent(fn) {
        this.event = fn.bind(this)
        return this
    }

    bindKey(fn, type) {
        this.keys = this.keys || []
        const bindFn = function (e) {
            fn.call(this, e.key)
        }.bind(this)
        window.addEventListener(type, bindFn)
        this.keys.push({ type, bindFn })
        return this
    }

    execute(fn) {
        fn.call(this)
        return this
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