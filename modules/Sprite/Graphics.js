import { Game } from "../Game/Game.js"

export function graphics(unit) {
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
            relY: unit.relY,
            offsetLeft: unit.offsetLeft,
            offsetTop: unit.offsetTop,
            drawWidth: unit.drawWidth,
            drawHeight: unit.drawHeight,
            scale: unit.scale,
            alpha: unit.alpha
        }
    }
    // 绘制图片
    let drawImage = (image) => {
        const { context, relX, relY, offsetLeft, offsetTop, drawWidth, drawHeight, scale, alpha } = getData()

        context.globalAlpha = alpha

        // 图片方向
        if (unit.direction === 'right') {
            const tranlateX = Math.floor(relX + offsetLeft)
            const tranlateY = Math.floor(relY + offsetTop)
            context.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
        } else {
            const tranlateX = Math.floor(Game.width - unit.width - relX + offsetLeft)
            const tranlateY = Math.floor(relY + offsetTop)
            context.drawFlip(Game.width, () => {
                // 因为粒子精灵是无宽度和高度的，绘制出来的图片它与自身宽高和精灵的scale有关
                context.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
            })
        }
    }
    // 绘制动画
    let drawAnimation = (image, flip, currFrame) => {
        const { context, relX, relY, offsetLeft, offsetTop, drawWidth, drawHeight, scale, alpha } = getData()

        context.globalAlpha = alpha

        // 图片方向
        if (!flip && unit.direction === 'right' || flip && unit.direction === 'left') {
            const tranlateX = Math.floor(relX + offsetLeft)
            const tranlateY = Math.floor(relY + offsetTop)
            context.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
        } else {
            const tranlateX = Math.floor(Game.width - unit.width * scale - relX + offsetLeft)
            const tranlateY = Math.floor(relY + offsetTop)
            // 水平翻转绘制
            context.drawFlip(Game.width, () => {
                context.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
            })
        }
    }

    // 初始化方法
    return {
        // 绘制
        draw(callback) {
            executor = () => callback.call(unit, Game.context)
        },
        // 混合
        mix(type, callback) {
            const mixCanvas = Game.canvas.cloneNode()
            const ctx = mixCanvas.getContext('2d')
            let mixImage = new Image();
            if (type === 'static') {
                ctx.clearRect(0, 0, Game.width, Game.height)
                callback(ctx)
                mixImage.src = mixCanvas.toDataURL("image/png");
                executor = () => {
                    Game.context.drawImage(mixImage, 0, 0)
                }
            } else if (type === 'dynamic') {
                executor = () => {
                    ctx.clearRect(0, 0, Game.width, Game.height)
                    callback(ctx)
                    mixImage.src = mixCanvas.toDataURL("image/png");
                    Game.context.drawImage(mixImage, 0, 0)
                }
            }
        },
        // 图片
        image(group, name, sameSize = false) {
            // 获取图片数据
            const image = Game.asset.get(group, name)

            setSize(image.width, image.height, sameSize)

            // 绘制函数
            executor = () => {
                drawImage(image)
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
            }
        },
        // 动画
        animation(group, name, sameSize = false) {
            // 获取动画数据
            const animation = Game.asset.get(group, name)

            setSize(animation.width, animation.image.height, sameSize)


            // 内部属性
            let currInterval = 0,
                currFrame = 0

            // 动画属性
            let options = Object.defineProperties({}, {
                // 动画帧数
                'animationFrames': {
                    value: (animation.image.width / animation.width) - 1
                },
                // 动画间隔帧
                'animationInterval': {
                    value: animation.interval || Game.animationInterval
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
                // 完成时
                'onComplete': {
                    value: null,
                    writable: true
                }
            })

            // 绘制函数
            executor = () => {
                // 绘制动画
                drawAnimation(animation.image, options.flip, currFrame)

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
                        options.onComplete && options.onComplete.call(this)
                    }
                }
            }

            // 返回数据
            return options
        },
        // 等待
        wait(interval, callback) {
            let count = 0
            const currExecutor = executor
            executor = () => {
                currExecutor && currExecutor()
                count++
                if (count === interval) {
                    executor = null
                    callback()
                }
            }
        },
        // 取消绑定
        unBind() {
            executor = null
        },
        test() {
            Game.context.strokeStyle = 'red'
            Game.context.strokeRect(unit.relX, unit.relY, unit.width, unit.height)
        },
        // 渲染
        render() {
            Game.context.globalAlpha = unit.alpha
            executor && executor()
            Game.test && this.test()
        }
    }
}
