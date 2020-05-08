import { Game } from "../Game/Game.js"
import { Sprite } from "../Sprite/Sprite.js"

export function camera(stage) {
    let camera = {
        x: 0,
        y: 0,
        follow: null,
        movement: null
    }
    // 创建镜头移动函数
    let createMovement = (x, y, time = 0, callback, disable) => {
        // 设置数据
        let frames = time * Game.frames
        let perX = x / frames
        let perY = y / frames

        // 取消相机跟随
        camera.follow = null

        // 调整相机位置
        if (camera.x < 0) {
            camera.x = 0
        }
        if (camera.x > stage.width - Game.width) {
            camera.x = stage.width - Game.width
        }

        // 移动计数
        let count = 0

        // 禁用精灵
        if (disable !== false) {
            Sprite.unit.travel(unit => {
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
            if (count > frames || (camera.x < 0 || camera.x > stage.width - Game.width)) {
                // 清空相机移动函数
                camera.movement = null

                // 启用精灵
                if (disable !== false) {
                    Sprite.unit.travel(unit => {
                        unit.disabled = false
                    })
                }

                // 执行回调函数
                callback && callback()
            }
        }
    }

    // 计算镜头位置
    let cal = () => {
        // 当相机跟随精灵时
        if (camera.follow) {
            // 相机处于游戏宽度范围内才会跟随精灵x变化，否则固定值
            if (camera.follow.x < Game.width / 2 - camera.follow.width / 2) {
                camera.x = 0
            } else if (camera.follow.x > stage.width - Game.width / 2 - camera.follow.width / 2) {
                camera.x = stage.width - Game.width
            } else {
                camera.x = camera.follow.x - Game.width / 2 + camera.follow.width / 2
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
        // 解除跟随
        unFollow() {
            camera.follow = null
        },
        // 移动
        move(x, y, time, callback) {
            createMovement(x, y, time, callback)
        },
        // 移动到
        moveTo(unit, time, callback) {
            createMovement((unit.x - camera.x) - Game.width / 2 + unit.width / 2, (unit.y - camera.y), time, callback)
        },
        // 获取镜头
        get() {
            // 计算镜头数据
            cal()
            // 返回镜头数据(只读)
            return Object.assign({}, camera)
        }
    }
}