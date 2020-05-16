"use strict"
import { Game } from "../Game/Game.js";
import { camera } from "./Camera.js";
import { event } from "./Event.js";
import { geometry } from "./Geometry.js";
import { execute } from "./Execute.js";

export class Stage {
    constructor(options) {
        Game.asset.allLoaded(() => {
            // 销毁场景
            Game.stage && Game.stage.execute.destory()

            // 清空按键
            Game.key = null

            // 改变当前场景
            Game.stage = this

            // 初始化场景数据
            const config = options.config
            Stage.width = (config && config.width) || Game.width
            Stage.height = (config && config.height) || Game.height
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
                },
                'height': {
                    get() {
                        return Stage.height
                    },
                    set(newVal) {
                        if (Stage.height !== newVal) {
                            Stage.height = newVal
                        }
                    }
                }
            })

            // 初始化实例方法
            this.camera = camera()
            this.event = event(this)
            this.geometry = geometry()
            this.execute = execute(this)

            // 执行回调函数
            options.created && options.created.call(this)

            // 进入循环
            this.execute.loop()
        })
    }
}