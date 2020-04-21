class Game {
    constructor(options) {
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.currStage = null
        Game.animations = {}
        Game.images = {}
        Game.audio = {}
        Game.imagePath = ''
        Game.audioPath = ''
        this.promises = []
    }

    // 创建游戏
    create(fn) {
        fn.call(this)
    }

    // 创建场景
    startWith(stage, ...args) {
        Game.canvas.setAttribute('width', Game.width)
        Game.canvas.setAttribute('height', Game.height)

        Promise.all(this.promises)
            .then(() => {
                Game.currStage = stage(args)
            })
            .catch(err => console.log(err))
    }

    // 载入图片
    loadImage(id, url) {
        let img = Game.images[id] = new Image()
        this.promises.push(
            new Promise((resolve, reject) => {
                img.onload = () => {
                    if (img.fileSize > 0 || (img.width > 0 && img.height > 0)) {
                        resolve('load')
                    } else {
                        reject(img.src)
                    }
                }
            })
        )
        img.src = Game.imagePath + url
    }

    // 载入动画
    loadAnimation(id, name, url, length, type) {
        Game.animations[id] = Game.animations[id] || {}
        let images = Game.animations[id][name] = []
        type = type || 'png'
        for (let i = 0; i < length; i++) {
            images[i] = new Image()
            this.promises.push(
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
            images[i].src = `${Game.imagePath}${url}${i + 1}.${type}`
        }
    }

    // 载入音频
    loadAudio(audio) {
        Game.audio[audio.id] = new Audio(Game.audioPath + audio.url)
    }

    // 转场
    static cutscenes() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    // 切换场景
    static switchStage(stage, ...args) {
        this.currStage.destory()
        this.cutscenes()
        setTimeout(() => {
            this.currStage = stage(args)
        }, 300)
    }
}