export class Game {
    // 初始化Game类
    static init(options) {
        // 获取canvas
        const canvas = document.getElementById(options.el)

        // 初始化canvas
        Object.defineProperties(Game, {
            'context': {
                value: canvas.getContext('2d')
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

        // 设置body属性
        document.body.style.userSelect = 'none'
        document.body.style.margin = 0
        document.body.style.padding = 0
        document.body.style.overflow = 'hidden'
        document.body.style.textAlign = 'center'

        // 设置canvas宽高
        canvas.setAttribute('width', Game.width + 'px')
        canvas.setAttribute('height', Game.height + 'px')

        // 初始化参数
        Game.frames = 60
        Game.animationInterval = 16
        Game.key = null
        Game.test = false

        // 初始化load方法和参数
        Game.load = Game.load()
        Game.audioPath = options.path.audio || ''
        Game.imagePath = options.path.image || ''

        delete Game.init
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
                    setTimeout(() => {
                        currStage = stages[newStage](...args)
                        this.sprite.travel(sprite => {
                            currStage.sprite.add(sprite)
                        })
                    }, 300)
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
                value: callback => {
                    for (const key in sprites) {
                        callback(sprites[key])
                    }
                }
            }
        })
    }

    // 载入
    static load() {
        // 初始化载入方法
        return Object.defineProperties({}, {
            // 载入图片
            'image': {
                value: (id, url) => {
                    let image = new Image()
                    image.src = Game.imagePath + url
                    Game.image.add(id, image)
                }
            },
            // 载入动画
            'animation': {
                value: (id, name, url) => {
                    let image = new Image()
                    image.src = Game.imagePath + url
                    Game.animation.add(id, name, image)
                }
            },
            // 载入音频
            'audio': {
                value: (id, url) => {
                    Game.audio.add(id, Game.audioPath + url)
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
                value: (id, width, interval, flip) => {
                    animations[id] = {}
                    animations[id].width = width
                    animations[id].interval = interval || Game.interval
                    animations[id].flip = flip || false
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
                        image: animations[id][name],
                        width: animations[id].width,
                        flip: animations[id].flip,
                        interval: animations[id].interval
                    }
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
                value: (name, url) => {
                    audio[name] = new Audio(url)
                }
            },
            // 获取
            'get': {
                value: name => {
                    return audio[name]
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
                value: (name, volume, alone) => {
                    if (alone) {
                        this.audio.get(name).play()
                    } else {
                        let sound = this.audio.get(name).cloneNode()
                        sound.volume = volume || 1
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