export class Game {
    constructor(options, fn) {
        // 初始化实例
        this.init(options)

        // 执行回调函数
        fn.call(this)
    }

    // 初始化实例
    init(options) {
        Game.canvas = document.getElementsByTagName('canvas')[0]

        // 初始化canvas
        Object.defineProperties(Game, {
            'canvas': {
                value: Game.canvas
            },
            'ctx': {
                value: Game.canvas.getContext('2d')
            },
            'width': {
                value: options.width
            },
            'height': {
                value: options.height
            },
            'audio': {
                value: Game.audio()
            },
            'image': {
                value: Game.image()
            },
            'animation': {
                value: Game.animation()
            },
            'sound': {
                value: Game.sound()
            },
            'music': {
                value: Game.music()
            },
            'stage': {
                value: Game.stage(options.stages)
            },
            'sprite': {
                value: Game.sprite()
            },
        })

        // 设置canvas宽高
        Game.canvas.setAttribute('width', Game.width + 'px')
        Game.canvas.setAttribute('height', Game.height + 'px')

        // 初始化参数
        Game.frames = 60
        Game.animationInterval = 16
        Game.key = null

        // 初始化load方法和参数
        this.load = this.load()
        this.audioPath = options.path.audio || ''
        this.imagePath = options.path.image || ''
        this.promises = []

        delete this.init
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

    // 场景
    static stage(stages) {
        let currStage = null

        // 初始化场景方法
        return Object.defineProperties({}, {
            // 切换
            'switch': {
                value: (newStage, ...args) => {
                    currStage && currStage.execute.destory()
                    this.key = null
                    this.stage.cutscenes()
                    setTimeout(() => {
                        currStage = stages[newStage](...args)
                        this.sprite.travel(sprite => {
                            currStage.sprite.add(sprite)
                        })
                    }, 300)
                }
            },
            // 转场
            'cutscenes': {
                value: () => {
                    this.ctx.fillStyle = 'black'
                    this.ctx.fillRect(0, 0, this.width, this.height)
                }
            }
        })
    }

    // 全局sprite(在场景创建时加入场景单位中)
    static sprite() {
        let sprites = {}

        // 初始化sprite方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: newSprite => {
                    sprites[newSprite.id] = newSprite
                }
            },
            // 删除
            'del': {
                value: id => {
                    if (sprites[id]) {
                        sprites[id].userEvent.delAll()
                        delete sprites[id]
                    }
                }
            },
            // 遍历
            'travel': {
                value: () => {
                    for (const key in sprites) {
                        fn(sprites[key])
                    }
                }
            }
        })
    }

    // 载入
    load() {
        let pushPromise = img => {
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
        }

        // 初始化载入方法
        return Object.defineProperties({}, {
            // 载入图片
            'image': {
                value: (id, url) => {
                    let image = new Image()
                    Game.image.add(id, image)
                    pushPromise(image)
                    image.src = this.imagePath + url
                }
            },
            // 载入动画
            'animation': {
                value: (id, name, url) => {
                    let image = new Image()
                    Game.animation.add(id, name, image)
                    pushPromise(image)
                    image.src = this.imagePath + url
                }
            },
            // 载入音频
            'audio': {
                value: (id, url) => {
                    Game.audio.add(id, this.audioPath + url)
                }
            }
        })
    }

    // 音频
    static audio() {
        let audio = {}

        // 初始化音频方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (id, url) => {
                    audio[id] = new Audio(url)
                }
            },
            // 获取
            'get': {
                value: id => {
                    return audio[id]
                }
            }
        })
    }

    // 图片
    static image() {
        let images = {}

        // 初始化图片方法
        return Object.defineProperties({}, {
            // 添加
            'add': {
                value: (id, img) => {
                    images[id] = img
                }
            },
            // 获取
            'get': {
                value: id => {
                    return images[id]
                }
            }
        })
    }

    // 动画
    static animation() {
        let animations = {}

        // 初始化动画方法
        return Object.defineProperties({}, {
            // 添加角色
            'role': {
                value: (id, options) => {
                    animations[id] = {}
                    animations[id].options = options
                }
            },
            // 添加
            'add': {
                value: (id, name, image) => {
                    animations[id][name] = image
                }
            },
            // 获取动画
            'get': {
                value: (id, name) => {
                    return {
                        options: animations[id].options,
                        image: animations[id][name]
                    }
                }
            }
        })
    }

    // 音乐
    static music() {
        let music = null

        // 初始化音乐方法
        return Object.defineProperties({}, {
            // 播放
            'play': {
                value: name => {
                    if (music === this.audio.get(name)) {
                        music.play()
                    } else {
                        music = this.audio.get(name)
                        music.play()
                    }
                }
            },
            // 暂停
            'pause': {
                value: () => {
                    music.pause()
                }
            },
            // 停止
            'stop': {
                value: () => {
                    music.pause()
                    music.currentTime = 0
                }
            },
            // 循环
            'loop': {
                value: boolean => {
                    music.loop = boolean
                }
            }
        })
    }

    // 音效
    static sound() {
        // 初始化音效方法
        return Object.defineProperties({}, {
            'play': {
                value: (name, vol, single) => {
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
        })
    }
}