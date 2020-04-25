import { warning } from "../sprites/Warning.js"

export function noShoot() {
    // 禁用玩家
    let player = this.unit.find('player')
    player.disabled = true
    player.stop()

    // 禁用npc
    this.unit.travel(unit => {
        if (unit.type === 'npc') {
            unit.disabled = true
        }
    })

    // 添加warning
    this.unit.add(warning())

    // 删除当前事件
    this.event.del('noShoot')

    this.camera.move(2, 0, 100, () => {
        this.camera.move(-2, 0, 100, () => {
            this.camera.follow(player)
            this.unit.del('warning')
            player.disabled = false
            this.unit.travel(unit => {
                if (unit.type === 'npc') {
                    unit.disabled = false
                }
            })
        })
    })
}