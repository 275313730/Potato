import { Game } from "./Game.js"
import { Stage } from "../Stage/Stage.js"

export function execute() {
    let currentStage = null

    return {
        // 切换场景
        switchStage(newStage) {
            Game.asset.allLoaded(() => {
                // 销毁场景
                currentStage && currentStage.execute.destory()

                // 清空按键
                Game.key = null

                // 创建场景
                currentStage = new Stage(newStage) 
            })
        }
    }
}