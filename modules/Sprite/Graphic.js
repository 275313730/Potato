import { Game } from "../Game/Game.js"

export function graphic(unit) {
    // 执行函数
    let executor = null
    // 绘制图片
    let drawImage = image => {
        const context = Game.context
        const relX = unit.relX
        const y = unit.y
        const offsetLeft = unit.offsetLeft
        const offsetTop = unit.offsetTop
        const width = image.width
        const height = image.height
        const scale = unit.scale

        // 图片方向
        if (unit.direction === 'right') {
            context.drawImage(image, 0, 0, width, height, relX + offsetLeft, y + offsetTop, width * scale, height * scale)
        } else {
            const tranlateX = Game.width - unit.width - relX
            context.drawFlip(Game.width, () => {
                // 绘制图片的数据要用图片属性
                // 因为粒子精灵是无宽度和高度的，绘制出来的图片它与自身宽高和精灵的scale有关
                context.drawImage(image, 0, 0, width, height, tranlateX + offsetLeft, y + offsetTop, width * scale, height * scale)
            })
        }
    }
    // 绘制动画
    let drawAnimation = (image, options) => {
        // 获取绘制数据
        const context = Game.context
        const relX = unit.relX
        const y = unit.y
        const offsetLeft = unit.offsetLeft
        const offsetTop = unit.offsetTop
        const width = options.width
        const height = options.height
        const scale = unit.scale
        const direction = unit.direction
        const currFrame = options.currFrame

        // 图片方向
        if (!options.flip && direction === 'right' || options.flip && direction === 'left') {
            context.drawImage(image, currFrame * width, 0, width, height, relX + offsetLeft, y + offsetTop, width * scale, height * scale)
        } else {
            const tranlateX = Game.width - unit.width * scale - relX
            // 水平翻转绘制
            context.drawFlip(Game.width, () => {
                // 动画绘制的数据要用精灵属性
                // 因为动画是由图片裁剪出来的，只与精灵自身宽高有关，跟图片无关
                context.drawImage(image, currFrame * width, 0, width, height, tranlateX + offsetLeft, y + offsetTop, width * scale, height * scale)
            })
        }
    }

    // 初始化方法
    return {
        // 形状(canvas绘制)
        shape(callback) {
            executor = () => callback.call(unit, Game.context)
        },
        // 图片
        image(name) {
            // 获取图片数据
            let image = Game.image.get(name)

            unit.width = image.width
            unit.height = image.height

            // 绘制函数
            executor = () => {
                drawImage(image)

                // 测试
                Game.test && Game.context.test(unit.relX, unit.y, unit.width, unit.height)
            }

        },
        // 粒子
        particle(name, interval = 60, alphaRange, scaleRange) {
            let image = Game.image.get(name)

            // 设置精灵尺寸(粒子精灵没有宽度和高度)
            Object.defineProperties(unit, {
                'width': {
                    value: 0
                },
                'height': {
                    value: 0
                }
            })

            // 设置粒子属性
            let nextAlpha, nextscale

            // 检查粒子是否有透明度变化
            if (alphaRange) {
                nextAlpha = (alphaRange[1] - alphaRange[0]) / interval
            }

            // 检查粒子是否有尺寸变化
            if (scaleRange) {
                nextscale = (scaleRange[1] - scaleRange[0]) / interval
                unit.scale = scaleRange[1]
            }

            executor = () => {
                // 透明度变化
                if (nextAlpha != null) {
                    if (unit.alpha + nextAlpha <= alphaRange[0] || unit.alpha + nextAlpha >= alphaRange[1]) {
                        nextAlpha = -nextAlpha
                    }
                    unit.alpha += nextAlpha
                }

                // 尺寸变化
                if (nextscale != null) {
                    if (unit.scale + nextscale <= scaleRange[0] || unit.scale + nextscale >= scaleRange[1]) {
                        nextscale = - nextscale
                    }
                    unit.scale += nextscale
                }

                drawImage(image)

                // 测试
                Game.test && Game.context.test(unit.relX, unit.y, unit.width, unit.height)
            }
        },
        // 动画
        animation(id, name, sameSize = true) {
            // 获取动画数据
            const animation = Game.animation.get(id, name)

            unit.drawWidth = animation.width
            unit.drawHeight = animation.image.height

            if (sameSize) {
                unit.width = unit.drawWidth
                unit.height = unit.drawHeight
            }

            // 只读属性
            let playing = true,
                currInterval = 0,
                currFrame = 0

            // 动画属性
            let options = Object.defineProperties({}, {
                // 总动画帧
                'animationFrames': {
                    value: (animation.image.width / animation.width) - 1
                },
                // 当前动画帧
                'currFrame': {
                    get() {
                        return currFrame
                    }
                },
                // 动画间隔帧
                'animationInterval': {
                    value: animation.interval || Game.animationInterval
                },
                // 当前间隔帧
                'currInterval': {
                    get() {
                        return currInterval
                    }
                },
                // 动画帧宽度
                'width': {
                    value: animation.width
                },
                // 动画帧高度
                'height': {
                    value: animation.image.height
                },
                // 是否翻转
                'flip': {
                    value: animation.flip
                },
                // 动画状态
                'playing': {
                    get() {
                        return playing
                    }
                },
                // 完成时
                'onComplete': {
                    value: null,
                    writable: true
                },
                // 播放
                'play': {
                    value: () => {
                        playing = true
                    }
                },
                // 暂停
                'pause': {
                    value: () => {
                        playing = false
                        this.currInterval = 0
                    }
                },
                // 停止
                'stop': {
                    value: () => {
                        playing = false
                        this.currFrame = 0
                        this.currInterval = 0
                    }
                }
            })

            // 绘制函数
            executor = () => {
                // 绘制动画
                drawAnimation(animation.image, options)

                // 测试 
                Game.test && Game.context.test(unit.relX, unit.y, unit.width, unit.height)

                // 暂停/停止
                if (!playing) { return }

                // 动画间隔帧增加
                currInterval++

                // 判断计数是否小于间隔帧数
                if (currInterval >= options.animationInterval) {
                    // 动画当前间隔帧归零
                    currInterval = 0

                    // 动画关键帧增加
                    currFrame++

                    // 判断是否播放完成
                    if (currFrame >= options.animationFrames) {
                        // 动画重置
                        currFrame = 0

                        // 动画完成时执行函数
                        options.onComplete && options.onComplete()
                    }
                }
            }

            // 返回数据
            return options
        },
        // 取消绑定
        unBind() {
            executor = null
        },
        // 执行
        execute() {
            Game.context.globalAlpha = unit.alpha
            if (executor) {
                executor()
            } else {
                // 测试
                executor = () => Game.test && Game.context.test(unit.relX, unit.y, unit.width, unit.height)
            }
        }
    }
}
