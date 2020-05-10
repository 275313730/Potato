import { Game } from "../Game/Game.js"

export function graphic(unit) {
    // 执行函数
    let executor = null
    // 设置尺寸
    let setSize = (width, height, sameSize) => {
        Object.defineProperties(unit, {
            'drawWidth': {
                value: width
            },
            'drawHeight': {
                value: height
            }
        })

        if (sameSize) {
            unit.width = width
            unit.height = height
        }
    }
    // 获取绘制数据
    let getData = () => {
        return {
            context: Game.context,
            relX: unit.relX,
            y: unit.y,
            offsetLeft: unit.offsetLeft,
            offsetTop: unit.offsetTop,
            width: unit.drawWidth,
            height: unit.drawHeight,
            scale: unit.scale,
            alpha: unit.alpha
        }
    }
    // 绘制图片
    let drawImage = (image) => {
        const { context, relX, y, offsetLeft, offsetTop, width, height, scale, alpha } = getData()

        context.globalAlpha = alpha

        // 图片方向
        if (unit.direction === 'right') {
            const tranlateX = Math.floor(relX + offsetLeft)
            const tranlateY = Math.floor(y + offsetTop)
            context.drawImage(image, 0, 0, width, height, tranlateX, tranlateY, width * scale, height * scale)
        } else {
            const tranlateX = Game.width - unit.width - relX + offsetLeft
            const tranlateY = Math.floor(y + offsetTop)
            context.drawFlip(Game.width, () => {
                // 因为粒子精灵是无宽度和高度的，绘制出来的图片它与自身宽高和精灵的scale有关
                context.drawImage(image, 0, 0, width, height, tranlateX, tranlateY, width * scale, height * scale)
            })
        }
    }
    // 绘制动画
    let drawAnimation = (image, options) => {
        const { context, relX, y, offsetLeft, offsetTop, width, height, scale, alpha } = getData()

        context.globalAlpha = alpha

        // 图片方向
        if (!options.flip && unit.direction === 'right' || options.flip && unit.direction === 'left') {
            const tranlateX = Math.floor(relX + offsetLeft)
            const tranlateY = Math.floor(y + offsetTop)
            context.drawImage(image, options.currFrame * width, 0, width, height, tranlateX, tranlateY, width * scale, height * scale)
        } else {
            const tranlateX = Math.floor(Game.width - unit.width * scale - relX + offsetLeft)
            const tranlateY = Math.floor(y + offsetTop)
            // 水平翻转绘制
            context.drawFlip(Game.width, () => {
                context.drawImage(image, options.currFrame * width, 0, width, height, tranlateX, tranlateY, width * scale, height * scale)
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
        image(group, name, sameSize = true) {
            // 获取图片数据
            const image = Game.asset.get(group, name)

            setSize(image.width, image.height, sameSize)

            // 绘制函数
            executor = () => {
                drawImage(image)

                // 测试
                Game.test && Game.context.test(unit.relX, unit.y, unit.width, unit.height)
            }
        },
        // 粒子
        particle(group, name, interval, alphaRange, scaleRange) {
            const image = Game.asset.get(group, name)

            // 设置精灵尺寸(粒子精灵没有宽度和高度)
            Object.defineProperties(unit, {
                'width': {
                    value: 0
                },
                'height': {
                    value: 0
                },
                'drawWidth': {
                    value: image.width
                },
                'drawHeight': {
                    value: image.height
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
        animation(group = 'default', name, sameSize = true) {
            // 获取动画数据
            const animation = Game.asset.get(group, name)

            setSize(animation.width, animation.image.height, sameSize)


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
        // 渲染
        render() {
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
