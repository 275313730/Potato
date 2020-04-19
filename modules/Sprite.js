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

    loadImage(url) {
        this.img = new Image()
        this.img.onload = () => {
            const ctx = Game.ctx
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
        this.img.src = url
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