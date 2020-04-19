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

        return this
    }

    loadImage() {
        this.img = new Image()
        this.img.onload = () => {
            const ctx = Stage.ctx
            if (this.sticky) {
                this.draw = () => {
                    let unit = JSON.parse(JSON.stringify(this))
                    unit.x += unit.sticky.x
                    unit.y += unit.sticky.y
                    ctx.drawImage(this.img, this.x, this.y)
                }
            } else {
                this.draw = () => {
                    ctx.globalAlpha = this.alpha || 1
                    ctx.beginPath()
                    ctx.drawImage(this.img, this.x, this.y)
                    ctx.closePath()
                }
            }
        }
        this.img.src = this.url
        return
    }

    stick(id) {
        this.sticky = Sprite.find(id)
        return this
    }

    bindEvent(fn) {
        this.event = fn.bind(this)
        return this
    }

    bindKey(fn, type) {
        window.addEventListener(type, function (e) {
            fn.call(this, e.key)
        }.bind(this))
        return this
    }

    execute(fn) {
        fn.call(this)
    }

    static find(id) {
        return Sprite.units[id]
    }

    static delete(id) {
        delete Sprite.units[id]
    }
}