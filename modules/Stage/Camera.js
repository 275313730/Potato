import { Game } from "../Game/Game.js"
import { Stage } from "./Stage.js"

export function camera() {
    let camera = {
        x: 0,
        y: 0,
        scale: 1,
        follow: null,
        movement: null
    }
    // 创建镜头移动函数
    let createMovement = (x, y, time, callback, disable = true) => {
        // 计算数据
        let frames = time * Game.frames || 1

        let perX = x / frames
        let perY = y / frames

        if (perX === 0 && perY === 0) {
            return
        }

        // 取消相机跟随
        camera.follow = null

        // 调整相机位置
        if (camera.x < 0) {
            camera.x = 0
        }
        if (camera.x > Stage.width - Game.width) {
            camera.x = Stage.width - Game.width
        }

        // 移动计数
        let count = 0

        // 禁用精灵
        if (disable === true) {
            Game.unit.travel(unit => {
                unit.disabled = true
            })
        }

        camera.movement = () => {
            // 相机移动
            camera.x += perX
            camera.y += perY

            // 移动计数增加
            count++

            // 判断移动计数和相机位置
            if (count > frames || (camera.x <= 0 || camera.x >= Stage.width - Game.width)) {
                // 清空相机移动函数
                camera.movement = null

                // 启用精灵
                if (disable === true) {
                    Game.unit.travel(unit => {
                        unit.disabled = false
                    })
                }

                // 执行回调函数
                callback && callback()
                return
            }
        }
    }

    // 计算镜头位置
    let cal = () => {
        const follow = camera.follow
        // 当相机跟随精灵时
        if (follow) {
            const fx = follow.x
            const fy = follow.y
            const fw = follow.width
            const fh = follow.height

            // 相机处于舞台宽度范围内才会跟随精灵x变化，否则固定值
            if (fx < (Game.width - fw) / 2) {
                camera.x = 0
            } else if (fx > Stage.width - (Game.width + fw) / 2) {
                camera.x = Stage.width - Game.width
            } else {
                camera.x = fx - (Game.width - fw) / 2
            }

            // 相机处于舞台高度范围内才会跟随精灵x变化，否则固定值
            if (fy < (Game.height - fh) / 2) {
                camera.y = 0
            } else if (fy > Stage.height - (Game.height + fh) / 2) {
                camera.y = Stage.height - Game.height
            } else {
                camera.y = fy - (Game.height - fh) / 2
            }
        } else {
            // 执行相机移动函数
            camera.movement && camera.movement()
        }
    }

    return {
        // 跟随
        follow(unit) {
            if (unit === camera.follow) { return }
            camera.follow = unit
        },
        // 获取镜头数据
        get() {
            // 计算镜头数据
            cal()
            // 返回镜头数据(只读)
            return Object.assign({}, camera)
        },
        // 移动
        move(x, y, time, callback) {
            createMovement(x, y, time, callback)
        },
        // 移动到
        moveTo(unit, time, callback) {
            let x = unit.x
            let y = unit.y
            if (Game.width === Stage.width) {
                x = 0
            } else {
                if (x < Game.width / 2) {
                    x = 0
                } else if (x > Stage.width - Game.width) {
                    x = Stage.width - Game.width + unit.width / 2
                } else {
                    x -= (Game.width - unit.width) / 2
                }
            }

            if (Game.height === Stage.height) {
                y = 0
            } else {
                if (y < Game.height / 2) {
                    y = 0
                } else if (y > Stage.height - Game.height) {
                    y = Stage.height - Game.height + unit.height / 2
                } else {
                    y -= (Game.height - unit.height) / 2
                }
            }
            console.log(x, y)

            createMovement((x - camera.x), (y - camera.y), time, callback)
        },
        // 解除跟随
        unFollow() {
            camera.follow = null
        },
    }
}