export class Game {
    constructor(options, fn) {
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
        Game.sound = Game.sound()
        Game.music = Game.music()
        Game.stage = Game.stage(options.stages)
        fn.call(this)
    }

    // 创建场景
    start(stage, ...args) {
        Game.canvas.setAttribute('width', Game.width)
        Game.canvas.setAttribute('height', Game.height)
        Promise.all(this.promises)
            .then(() => {
                Game.stage.switch(stage, ...args)
            })
            .catch(err => console.log(err))
    }

    load() {
        return {
            // 载入图片
            image: (id, url) => {
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
            },
            // 载入动画
            animation: (id, name, url, length, type) => {
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
            },
            // 载入音频
            audio: (id, url) => {
                Game.audio[id] = new Audio(Game.audioPath + url)
            }
        }
    }

    // 场景
    static stage(stages) {
        let currStage = null
        return {
            // 切换
            switch: (newStage, ...args) => {
                currStage && currStage.execute.destory()
                this.stage.cutscenes()
                setTimeout(() => {
                    currStage = stages[newStage](...args)
                }, 100)
            },
            // 转场
            cutscenes: () => {
                this.ctx.fillStyle = 'black'
                this.ctx.fillRect(0, 0, this.width, this.height)
            }
        }
    }

    // 音乐
    static music() {
        let music = null
        return {
            // 播放
            play: name => {
                if (music === this.audio[name]) {
                    music.play()
                } else {
                    music = this.audio[name]
                    music.play()
                }
            },
            // 暂停
            pause: () => {
                music.pause()
            },
            // 停止
            stop: () => {
                music.currentTime = 0
            },
            // 循环
            loop: boolean => {
                music.loop = boolean
            }
        }
    }

    // 音效
    static sound() {
        return {
            play: (name, vol, single) => {
                if (single) {
                    this.audio[name].play()
                } else {
                    let sound = this.audio[name].cloneNode()
                    sound.volume = vol || 1
                    sound.play()
                    sound.addEventListener('ended', () => {
                        sound = null
                    })
                }
            }
        }
    }
}