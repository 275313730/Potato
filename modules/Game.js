"use strict"
import { Sprite } from "./Sprite.js"

export class Game {
    // 初始化Game类
    static init(options) {
        // 监听键盘事件
        window.addEventListener('keydown', e => {
            e.preventDefault()
        })
        window.addEventListener('keyup', e => {
            e.preventDefault()
            if (Game.key === e.key) {
                Game.key = null
            }
        })
        window.addEventListener('mousedown', e => {
            e.preventDefault()
        })
        window.addEventListener('mouseup', e => {
            Game.mouseDown = false
        })

        // 获取canvas
        Game.canvas = document.getElementById(options.el)
        // canvas上下文
        Game.context = Game.canvas.getContext('2d')
        // Game宽度
        Game.width = options.width
        // Game高度
        Game.height = options.height
        // 帧数
        Game.frames = 60
        // 动画间隔帧(每隔n帧绘制下一个关键帧)
        Game.animationInterval = 4
        // 键盘状态
        Game.key = null
        // 鼠标状态
        Game.mouseDown = false
        // 测试(显示精灵外框)
        Game.test = false
        // 音频路径
        Game.audioPath = options.path ? options.path.audio : ''
        // 图片路径
        Game.imagePath = options.path ? options.path.image : ''

        // 初始化实例方法
        Game.load = Game.load()
        Game.audio = Game.audio()
        Game.image = Game.image()
        Game.animation = Game.animation()
        Game.sound = Game.sound()
        Game.music = Game.music()
        Game.stage = Game.stage(options.stages)
        Game.sprite = Game.sprite()


        // 设置body属性
        document.body.style.userSelect = 'none'
        document.body.style.margin = 0
        document.body.style.padding = 0
        document.body.style.overflow = 'hidden'
        document.body.style.textAlign = 'center'

        // 设置canvas宽高
        Game.canvas.setAttribute('width', Game.width + 'px')
        Game.canvas.setAttribute('height', Game.height + 'px')

        delete Game.init
    }

    // 场景
    static stage(stages) {
        let currStage = null
        function swtichStage(newStage, ...args) {
            // 销毁场景
            currStage && currStage.execute.destory()

            // 清空按键
            Game.key = null

            // 创建场景
            currStage = stages[newStage](...args)
        }

        return {
            // 切换
            switch: (newStage, ...args) => {
                Game.load.allLoaded(() => swtichStage(newStage, ...args))
            }
        }
    }

    // 全局精灵
    static sprite() {
        let sprites = {}

        // 初始化方法
        return {
            // 添加
            add: options => {
                const newSprite = new Sprite(options)
                if (sprites[newSprite.id]) {
                    throw new Error(`Sprite '${newSprite.id}' exists.`)
                } else {
                    sprites[newSprite.id] = newSprite
                }
                return newSprite
            },
            // 删除
            del: id => {
                if (sprites[id]) {
                    sprites[id].userEvent.delAll()
                    delete sprites[id]
                } else {
                    throw new Error(`Sprite '${id}' doesn't exist.`)
                }
            },
            // 查找
            find: id => {
                return sprites[id]
            },
            // 遍历
            travel: callback => {
                for (const key in sprites) {
                    callback(sprites[key])
                }
            }
        }
    }

    // 载入
    static load() {
        let loadings = []

        // 初始化方法
        return {
            // 载入图片
            image: (name, url) => {
                if (Game.image.get(name)) { return }
                const image = new Image()
                image.src = Game.imagePath + url

                const newPromise = new Promise(resolve => {
                    image.onload = () => {
                        Game.image.add(name, image)
                        resolve(true)
                    }
                })
                loadings.push(newPromise)
            },
            // 载入动画
            animation: (id, name, url) => {
                if (Game.animation.get(id, name)) { return }
                const image = new Image()
                image.src = Game.imagePath + url

                const newPromise = new Promise(resolve => {
                    image.onload = () => {
                        Game.animation.addAnimation(id, name, image)
                        resolve(true)
                    }
                })

                loadings.push(newPromise)
            },
            // 载入音频
            audio: (name, url) => {
                if (Game.audio.get(name)) { return }
                Game.audio.add(name, new Audio(Game.audioPath + url))
            },
            allLoaded: callback => {
                if (loadings.length > 0) {
                    Promise.all(loadings)
                        .then(() => callback())
                } else {
                    callback()
                }
            }
        }
    }

    // 图片
    static image() {
        let images = {}

        // 初始化方法
        return {
            // 添加
            add: (name, img) => {
                if (images[name]) { return }
                images[name] = img
            },
            // 获取
            get: name => {
                return images[name]
            }
        }
    }

    // 动画
    static animation() {
        let animations = {}

        // 初始化方法
        return {
            // 添加角色
            addRole: (id, width, interval, flip) => {
                if (animations[id]) { return }
                animations[id] = {}
                animations[id].width = width
                animations[id].interval = interval || Game.interval
                animations[id].flip = flip || false
            },
            // 添加
            addAnimation: (id, name, image) => {
                if (animations[id][name]) { return }
                animations[id][name] = image
            },
            // 获取动画
            get: (id, name) => {
                if (animations[id][name]) {
                    return {
                        image: animations[id][name],
                        width: animations[id].width,
                        flip: animations[id].flip,
                        interval: animations[id].interval
                    }
                }
            }
        }
    }

    // 音频
    static audio() {
        let audios = {}

        // 初始化方法
        return {
            // 添加
            add: (name, audio) => {
                if (audios[name]) { return }
                audios[name] = audio
            },
            // 获取
            get: name => {
                return audios[name]
            }
        }
    }

    // 音乐
    static music() {
        let music = null

        // 初始化方法
        return {
            // 播放
            play: name => {
                // 切换音乐
                if (music) {
                    if (music !== this.audio.get(name)) {
                        music.currentTime = 0
                    }
                } else {
                    music = this.audio.get(name)
                }
                music.play()
                music.loop = true
            },
            // 暂停
            pause: () => {
                music.pause()
            },
            // 停止
            stop: () => {
                music.pause()
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
        // 初始化方法
        return {
            play: (name, volume, alone) => {
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
    }
}