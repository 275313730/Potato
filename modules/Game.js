class Game {
    constructor(options) {
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.promises = []
        Game.animations = {}
    }

    // 设置初始内容
    set(fn) {
        fn.call(this)
        return this
    }

    // 载入Stage
    start(stage, ...args) {
        Promise.all(Game.promises)
            .then(() => {
                Game.currStage = stage(args)
            })
            .catch(err => console.log(err))
    }

    loadAnimation(id, ...args) {
        Game.animations[id] = {}
        args.forEach(arg => {
            let images = Game.animations[id][arg.name] = []
            arg.type = arg.type || 'png'
            for (let i = 0; i < arg.length; i++) {
                images[i] = new Image()
                Game.promises.push(
                    new Promise((resolve, reject) => {
                        images[i].onload = () => {
                            if (images[i].fileSize > 0 || (images[i].width > 0 && images[i].height > 0)) {
                                resolve('load')
                            } else {
                                reject(images[i].src)
                            }
                        }
                    })
                )
                images[i].src = `${arg.url}${i + 1}.${arg.type}`
            }
        })
        return this
    }

    static switchStage(stage, ...args) {
        Game.currStage.destory()
        Game.currStage = stage(args)
    }
}