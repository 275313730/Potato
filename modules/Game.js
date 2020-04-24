export class Game {
    constructor(options, fn) {
        // 画面
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.canvas.setAttribute('width', Game.width + 'px')
        Game.canvas.setAttribute('height', Game.height + 'px')

        // 全局参数
        Game.imagePath = ''
        Game.audioPath = ''
        Game.frames = 60
        Game.flipVertical = true
        Game.key = null

        // 初始化方法
        Game.audio = Game.audio()
        Game.image = Game.image()
        Game.animation = Game.animation()
        Game.sound = Game.sound()
        Game.music = Game.music()
        Game.stage = Game.stage(options.stages)
        this.promises = []
        this.load = this.load()

        // 回调
        fn.call(this)
    }

    // 创建场景
    start(stage, ...args) {
        Promise.all(this.promises)
            .then(() => {
                this.promises = null
                Game.stage.switch(stage, ...args)
            })
            .catch(err => console.log(err))
    }

    load() {
        return {
            // 载入图片
            image: (id, url) => {
                let img = new Image()
                Game.image.add(id, img)
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
                let images = []
                Game.animation.add(id, name, images)
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
                Game.audio.add(id, url)
            }
        }
    }

    // 音频
    static audio() {
        let audio = {}
        return {
            add: (id, url) => {
                audio[id] = new Audio(Game.audioPath + url)
            },
            get: id => {
                return audio[id]
            }
        }
    }

    // 图片
    static image() {
        let images = {}
        return {
            add: (id, img) => {
                images[id] = img
            },
            get: id => {
                return images[id]
            }
        }
    }

    // 动画
    static animation() {
        let animations = {}
        return {
            add: (id, name, images) => {
                animations[id] = animations[id] || {}
                animations[id][name] = images
            },
            get: (id, name) => {
                return animations[id][name]
            }
        }
    }

    // 场景
    static stage(stages) {
        let currStage = null
        return {
            // 切换场景
            switch: (newStage, ...args) => {
                currStage && currStage.execute.destory()
                Game.key = null
                this.stage.cutscenes()
                setTimeout(() => {
                    currStage = stages[newStage](...args)
                }, 100)
            },
            // 转场
            cutscenes: () => {
                this.ctx.fillStyle = 'black'
                this.ctx.fillRect(0, 0, this.width, this.height)
            },
        }
    }

    // 音乐
    static music() {
        let music = null
        return {
            // 播放
            play: name => {
                if (music === this.audio.get(name)) {
                    music.play()
                } else {
                    music = this.audio.get(name)
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
                    this.audio.get(name).play()
                } else {
                    let sound = this.audio.get(name).cloneNode()
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