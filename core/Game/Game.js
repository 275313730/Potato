"use strict"
import { asset } from "./Asset.js";
import { unit } from "./Unit.js";
import { mix } from "./Mix.js";

export class Game {
    // 初始化Game类
    static init(options) {
        Object.defineProperties(this, {
            // canvas
            canvas: {
                value: document.getElementById(options.el)
            },
            // canvas上下文
            context: {
                value: document.getElementById(options.el).getContext('2d')
            },
            // 宽度
            width: {
                value: options.width
            },
            // 高度
            height: {
                value: options.height
            },
            // 键盘状态
            key: {
                value: null,
                writable: true
            },
            userEvents: {
                value: {}
            },
            // 动画间隔帧(每隔n帧绘制下一个关键帧)
            animationInterval: {
                value: options.animationInterval || 16,
                writable: true
            },
            // 测试(显示精灵外框)
            test: {
                value: false,
                writable: true
            },
            // 图片路径
            imagePath: {
                value: options.path ? options.path.image : '',
                writable: true
                // 音频路径
            },
            audioPath: {
                value: options.path ? options.path.audio : '',
                writable: true
            }
        })

        // 初始化实例方法
        this.asset = asset(this.imagePath, this.audioPath)
        this.unit = unit(Game)
        this.mix = mix

        // 设置canvas宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        // 执行用户事件
        function executeUserEvents(eventType, data) {
            const units = Game.userEvents
            for (const key in units) {
                const unit = units[key]
                if (unit[eventType]) {
                    unit[eventType](data)
                }
            }
        }

        // 键盘事件
        window.addEventListener('keydown', e => {
            e.stopPropagation()
            e.preventDefault()
            if (Game.key !== e.key) {
                Game.key = e.key
                executeUserEvents('keydown', e.key)
            }
        })
        window.addEventListener('keyup', e => {
            e.stopPropagation()
            e.preventDefault()
            if (Game.key === e.key) {
                Game.key = null
            }
            executeUserEvents('keyup', e.key)
        })

        // 计算鼠标数据
        function calMouse(e) {
            const canvas = Game.canvas

            // 计算画面缩放比例
            const scale = canvas.clientHeight / Game.height

            // 简化事件属性
            const mouse = {
                x: (e.clientX - canvas.offsetLeft) / scale,
                y: (e.clientY - canvas.offsetTop) / scale,
                button: e.button
            }
            return mouse
        }

        // 鼠标事件
        window.addEventListener('mousedown', e => {
            e.stopPropagation()
            e.preventDefault()
            executeUserEvents('mousedown', calMouse(e))
        })
        window.addEventListener('mouseup', e => {
            e.stopPropagation()
            e.preventDefault()
            executeUserEvents('mousedown', calMouse(e))
        })

        // 触屏事件
        window.addEventListener('touchstart', e => {
            executeUserEvents('touchstart', e)
        })
        window.addEventListener('touchend', e => {
            executeUserEvents('touchend', e)
        })

        // 禁用右键菜单
        window.oncontextmenu = function () {
            return false;
        }
    }
}