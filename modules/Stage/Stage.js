"use strict"
import { Game } from "../Game/Game.js";
import { camera } from "./Camera.js";
import { event } from "./Event.js";
import { geometry } from "./Geometry.js";
import { execute } from "./Execute.js";

export class Stage {
    constructor(options, callback) {
        // 判断是否传入id
        if (options.id == null) {
            throw new Error(`Stage need an id.`)
        }

        // 初始化场景数据
        this.id = options.id
        Stage.width = options.width || Game.width
        Stage.height = options.height || Game.height
        Object.defineProperties(this, {
            'width': {
                get() {
                    return Stage.width
                },
                set(newVal) {
                    if (Stage.width !== newVal) {
                        Stage.width = newVal
                    }
                }
            }
        })

        // 初始化实例方法
        this.camera = camera(this)
        this.event = event(this)
        this.geometry = geometry()
        this.execute = execute(this)

        // 执行回调函数
        callback && callback.call(this)

        // 进入循环
        this.execute.start()
    }
}