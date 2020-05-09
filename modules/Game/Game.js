"use strict"
import { asset } from "./Asset.js";
import { music } from "./Music.js";
import { sound } from "./Sound.js";
import { execute } from "./Execute.js";
import { unit } from "./Unit.js";

export class Game {
    // 初始化Game类
    static init(options) {
        // 禁用原生事件
        window.addEventListener('keydown', e => {
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('keyup', function (e) {
            e.stopPropagation()
            e.preventDefault()
            if (this.key === e.key) {
                this.key = null
            }
        }.bind(this))
        window.addEventListener('mousedown', function (e) {
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('mouseup', function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.mouseDown = false
        }.bind(this))

        // 获取canvas
        this.canvas = document.getElementById(options.el)
        // canvas上下文
        this.context = this.canvas.getContext('2d')
        // 宽度
        this.width = options.width
        // 高度
        this.height = options.height
        // 帧数
        this.frames = 60
        // 动画间隔帧(每隔n帧绘制下一个关键帧)
        this.animationInterval = 16
        // 键盘状态
        this.key = null
        // 鼠标状态
        this.mouseDown = false
        // 测试(显示精灵外框)
        this.test = false
        // 图片路径
        this.imagePath = options.path ? options.path.image : ''
        // 音频路径
        this.audioPath = options.path ? options.path.audio : ''

        // 初始化实例方法
        this.asset = asset(this.imagePath, this.audioPath)
        this.music = music(this.asset)
        this.sound = sound(this.asset)
        this.unit = unit()
        this.execute = execute()

        // 设置body属性
        document.body.style.userSelect = 'none'
        document.body.style.margin = 0
        document.body.style.padding = 0
        document.body.style.overflow = 'hidden'
        document.body.style.textAlign = 'center'

        // 设置canvas宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')
    }
}