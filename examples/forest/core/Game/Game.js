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
        this.unit = unit()
        this.mix = mix

        // 设置canvas宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')


        // 禁用原生事件
        window.addEventListener('keydown', e => {
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('keyup', e => {
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('mousedown', e => {
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('mouseup', e => {
            e.stopPropagation()
            e.preventDefault()
        })
        // 禁用右键菜单
        window.oncontextmenu = function () {
            return false;
        }
    }
}