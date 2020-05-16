import { Game } from "../Game/Game.js"

export function execute(stage) {
    let stop = false

    // 单位渲染和事件
    function unitExecute(unit, camera) {
        // 单位更新前
        unit.beforeUpdate && unit.beforeUpdate()

        // 计算相对位置
        unit.relX = unit.x - camera.x * (1 - unit.fixed)
        unit.relY = unit.y - camera.y * (1 - unit.fixed)

        // 计算音量
        unit.audio.cal()

        // 绘制画面
        unit.graphics.render()

        // 执行事件
        unit.event.execute()

        // 单位更新后
        unit.updated && unit.updated()
    }

    // 场景刷新
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

    return {
        // 销毁
        destory() {
            // 退出循环
            stop = true

            // 清空场景精灵
            Game.unit.delAll()
        },
        // 进入循环
        loop() {
            refresh()
        },
    }
}