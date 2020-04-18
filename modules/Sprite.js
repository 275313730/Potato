class Sprite {
    constructor(options) {
        Sprite.sprites = Sprite.sprites || {}
        if (!options.id) {
            throw new Error('Sprite needs an id.')
        }
        if (Sprite.sprites.id) {
            throw new Error('Sprite exists.')
        }
        for (const key in options) {
            this[key] = options[key]
        }
        Sprite.sprites[options.id] = this
    }

    bindEvent(type, fn) {
        switch (type) {
            case 'touch':
                Stage.events[this.id] = function () {
                    if (Engine.touch.call(this, Stage.player)) {
                        fn.call(this)
                    }
                }.bind(this)
                break
        }
        return this
    }

    bindDraw(type, fn) {
        Canvas.draws[this.id] = fn.bind(Canvas)
        switch (type) {
            case 'init':
                Canvas.draw()
                break
        }
        return this
    }

    static has(id) {
        return Sprite.sprites[id]
    }

    static delete(id) {
        delete Sprite.sprites[id]
        delete Stage.events[id]
    }
}