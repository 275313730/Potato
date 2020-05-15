import { Game } from "../Game/Game.js"

export function userEvent(sprite) {
    let userEvents = {}

    function bindFunction(callback, eventType, isBreak) {
        return function (e) {
            // 按键间隔检测
            if (isBreak) {
                if (e.type === 'keydown') {
                    if (Game.key === e.key) {
                        return
                    } else {
                        Game.key = e.key
                    }
                }

                if (e.type === 'mousedown') {
                    if (Game.mouseDown === true) {
                        return
                    } else {
                        Game.mouseDown = true
                    }
                }
            }

            // 没有加入到场景前禁用
            if (!sprite.stage) { return }

            // disabled时禁用
            if (sprite.disabled) { return }

            // 判断事件类型
            // 鼠标事件
            if (eventType === 'click' || eventType.indexOf('mouse') > -1) {
                const canvas = Game.canvas

                // 计算画面缩放比例
                const scale = canvas.clientHeight / Game.height
                
                // 简化事件属性
                const mouse = {
                    x: (e.clientX - canvas.offsetLeft) / scale,
                    y: (e.clientY - canvas.offsetTop) / scale,
                    button: e.button
                }
                callback.call(sprite, mouse)
                return
            }

            // 键盘事件
            if (eventType.indexOf('key') > -1) {
                callback.call(sprite, e.key)
            }
        }
    }

    // 初始化方法
    return {
        // 添加
        add(callback, eventType, isBreak) {
            // 判断用户事件是否存在
            if (userEvents[eventType]) {
                throw new Error(`UserEvent '${eventType}' exists.`)
            }

            // 添加事件到userEvents中
            userEvents[eventType] = bindFunction.call(sprite, callback, eventType, isBreak)

            // 监听事件
            window.addEventListener(eventType, userEvents[eventType])
        },
        // 删除
        del(eventType) {
            // 没有传参视为无效
            if (!eventType) {
                throw new Error(`This function need an eventType`)
            }

            // 判断用户事件是否存在
            if (!userEvents[eventType]) {
                throw new Error(`UserEvent ${eventType} doesn't exist.`)
            }

            // 解除监听
            window.removeEventListener(eventType, events[eventType])
        },
        // 删除所有
        delAll() {
            // 解绑用户事件
            for (const key in userEvents) {
                window.removeEventListener(key, userEvents[key])
            }

            // 清空用户事件
            userEvents = {}
        },
        // 一次
        once(func, eventType) {
            // 监听事件
            window.addEventListener(eventType, bindFunction.call(sprite, func), { once: true })
        },
    };
}