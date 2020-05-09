"use strict"
import { Game } from "../Game/Game.js";
import { Stage } from "../Stage/Stage.js";

import { graphic } from "./Graphic.js";
import { event } from "./Event.js";
import { userEvent } from "./UserEvent.js";
import { unit } from "./Unit.js";

export class Sprite {
    constructor(options) {
        // 设置参数
        const config = options.config

        // 设置初始参数
        this.id = config.id
        this.x = config.x || 0
        this.y = config.y || 0
        this.width = config.width || 0
        this.height = config.height || 0
        this.offsetLeft = config.offsetLeft || 0
        this.offsetTop = config.offsetTop || 0

        // global 决定是否全局精灵
        this.global = config.global || false

        // alpha 决定绘制透明度
        this.alpha = config.alpha || 1

        // scale 决定实际绘制尺寸
        this.scale = config.scale || 1

        // direction 决定图片的左右位置
        this.direction = config.direction || 'right'

        // layer 决定图片上下关系
        this.layer = config.layer || 0

        // diasabled 为true时无法执行精灵事件和用户事件
        this.disabled = config.disabled || false

        // fixed
        // 为0时随镜头移动
        // 为1时固定在页面上，不会随镜头移动
        // 在0~1之间会出现分层移动效果
        this.fixed = config.fixed || 0

        // Game的宽高(只读)
        Object.defineProperties(this, {
            'game': {
                value: {
                    width: Game.width,
                    height: Game.height
                }
            },
            'stage': {
                value: {
                    width: Stage.width,
                    height: Stage.height
                }
            }
        })

        let data = options.data || {}
        let methods = options.methods || {}

        // 设置实例数据
        for (const key in data) {
            this[key] = data[key]
        }

        // 设置实例事件
        for (const key in methods) {
            this[key] = methods[key]
        }

        // 检查id是否填写
        if (this.id == null) {
            throw new Error('Sprite needs an id.')
        }
        // 检查width和height
        if (this.width && this.width < 0) {
            throw new Error(`Sprite's width must be greater than 0`)
        }
        if (this.height && this.height < 0) {
            throw new Error(`Sprite's height must be greater than 0`)
        }
        // 检查方向
        if (this.direction && this.direction !== 'right' && this.direction !== 'left') {
            throw new Error(`Direction isn't correct.`)
        }

        // 初始化实例方法
        Sprite.unit = Sprite.unit || unit()
        this.graphic = graphic(this)
        this.event = event(this)
        this.userEvent = userEvent(this)
        Sprite.unit.add(this)

        // 创建实例
        options.created.call(this)
    }
}
