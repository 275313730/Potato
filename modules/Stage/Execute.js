import { Game } from "../Game/Game.js"

export function execute(stage) {
    function unitExecute(unit, camera) {
        // 计算相对位置
        unit.relX = unit.x - camera.x * (1 - unit.fixed)
        unit.relY = unit.y - camera.y * (1 - unit.fixed)

        // 绘制画面
        unit.graphic.render()

        // 执行事件
        unit.event.execute()
    }
    function refresh() {
        if (stop) { return }

        // 清除canvas
        Game.context.clearRect(0, 0, Game.width, Game.height)

        // 获取镜头数据
        let camera = stage.camera.get()

        // 执行场景事件
        stage.event.travel(event => {
            event.call(stage)
        })

        // 执行精灵渲染和事件
        Game.unit.travel(unit => {
            unitExecute(unit, camera)
        })

        window.requestAnimationFrame(refresh)
    }

    let stop = false

    return {
        // 刷新
        start() {
            refresh()
        },
        // 销毁
        destory() {
            // 退出循环
            stop = true

            // 清空场景精灵
            Game.unit.delAll()
        }
    }
}