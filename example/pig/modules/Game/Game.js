"use strict"
import { asset } from "./Asset.js";
import { unit } from "./Unit.js";

export class Game {
    // 初始化Game类
    static init(options) {
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
        this.unit = unit()

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
            if (this.key === e.key) {
                this.key = null
            }
        })
        window.addEventListener('mouseup', e => {
            e.stopPropagation()
            e.preventDefault()
            this.mouseDown = false
        })
        // 禁用右键菜单
        window.oncontextmenu = function () {
            return false;
        }
    }
}