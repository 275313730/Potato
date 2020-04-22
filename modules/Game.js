class Game {
    constructor(options) {
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.animations = {}
        Game.images = {}
        Game.audio = {}
        Game.sounds = []
        Game.imagePath = ''
        Game.audioPath = ''
        Game.frames = 60

        this.promises = []

        this.load = this.load()
        Game.music = Game.music()
    }

    // 创建游戏
    create(fn) {
        fn.call(this)
    }

    // 创建场景
    start(stage, ...args) {
        Game.canvas.setAttribute('width', Game.width)
        Game.canvas.setAttribute('height', Game.height)

        Promise.all(this.promises)
            .then(() => {
                Game.stage = stage(args)
            })
            .catch(err => console.log(err))
    }

    load() {
        // 载入图片
        function image(id, url) {
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
        function animation(id, name, url, length, type) {
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
        function audio(id, url) {
            Game.audio[id] = new Audio(Game.audioPath + url)
        }

        return {
            image: image.bind(this),
            animation: animation.bind(this),
            audio: audio.bind(this)
        }
    }

    // 转场
    static cutscenes() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    // 切换场景
    static switchStage(stage, ...args) {
        this.stage.destory()
        this.cutscenes()
        setTimeout(() => {
            this.stage = stage(args)
        }, 100)
    }


    static music() {
        let music = null

        function play(name) {
            if (music === this.audio[name]) {
                music.play()
            } else {
                music = this.audio[name]
                music.play()
            }
        }

        function pause() {
            music.pause()
        }

        function stop() {
            music.currentTime = 0
        }

        function loop(boolean) {
            music.loop = boolean
        }

        return {
            play: play.bind(this),
            pause: pause.bind(this),
            stop: stop.bind(this),
            loop: loop.bind(this)
        }
    }

    static sound() {
        function play(name, extra) {
            if (extra) {
                let sound = this.audio[name].cloneNode()
                sound.play()
                sound.addEventListener('ended', () => {
                    sound = null
                })
            } else {
                this.audio[name].play()
            }
        }

        return {
            play: play.bind(this)
        }
    }

}