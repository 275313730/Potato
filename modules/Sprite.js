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

    loadImage() {
        this.img = new Image()
        this.img.onload = () => {
            this.draw = () => Stage.ctx.drawImage(this.img, this.x, this.y)
        }
        this.img.src = this.src
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