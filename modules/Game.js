"use strict"
export class Game {
    // 初始化Game类
    static init(options) {
        // 禁用键盘原生事件
       /*  window.addEventListener('keydown', e => e.preventDefault()) */

        // 获取canvas
        const canvas = document.getElementById(options.el)

        // 初始化canvas
        Object.defineProperties(Game, {
            // canvas上下文
            'context': {
                value: canvas.getContext('2d')
            },
            // Game宽度
            'width': {
                value: options.width
            },
            // Game高度
            'height': {
                value: options.height
            },
            // 帧数
            'frames': {
                value: 60,
                writable: true
            },
            // 动画间隔帧(每隔n帧绘制下一个关键帧)
            'animationInterval': {
                value: 16,
                writable: true
            },
            // 当前按键
            'key': {
                value: null,
                writable: true
            },
            // 测试(显示精灵外框)
            'test': {
                value: false,
                writable: true
            },
            // 音频路径
            'audioPath': {
                value: options.path.audio || '',
                writable: true
            },
            // 图片路径
            'imagePath': {
                value: options.path.image || '',
                writable: true
            },
            // 载入
            'load': {
                value: Game.load()
            },
            // 音频
            'audio': {
                value: Game.audio()
            },
            // 图片
            'image': {
                value: Game.image()
            },
            // 动画
            'animation': {
                value: Game.animation()
            },
            // 音效
            'sound': {
                value: Game.sound()
            },
            // 音乐
            'music': {
                value: Game.music()
            },
            // 场景
            'stage': {
                value: Game.stage(options.stages)
            },
            // 精灵(全局精灵)
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

        delete Game.init
    }

    // 场景
    static stage(stages) {
        let currStage = null

        // 初始化方法
        return Object.defineProperties({}, {
            // 切换
            'switch': {
                value: (newStage, ...args) => {
                    // 销毁场景
                    currStage && currStage.execute.destory()

                    // 清空按键
                    Game.key = null

                    // 创建场景
                    currStage = stages[newStage](...args)
                }
            }
        })
    }

    // 全局sprite(在场景创建时加入场景单位中)
    static sprite() {
        let sprites = {}

        // 初始化方法
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
            }
        })
    }

    // 载入
    static load() {
        // 初始化方法
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

        // 初始化方法
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

        // 初始化方法
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

        // 初始化方法
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

        // 初始化方法
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
        // 初始化方法
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