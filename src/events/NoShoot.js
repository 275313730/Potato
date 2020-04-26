import { warning } from "../sprites/Warning.js"

export function noShoot() {
    // 禁用玩家
    let player = this.sprite.find('player')
    player.disabled = true
    player.stop()

    // 禁用npc
    this.sprite.travel(sprite => {
        if (sprite.type === 'npc') {
            sprite.disabled = true
        }
    })

    // 添加warning
    this.sprite.add(warning())

    // 删除当前事件
    this.event.del('noShoot')

    this.camera.move(2, 0, 100, () => {
        this.camera.move(-2, 0, 100, () => {
            this.camera.follow(player)
            this.sprite.del('warning')
            player.disabled = false
            this.sprite.travel(sprite => {
                if (sprite.type === 'npc') {
                    sprite.disabled = false
                }
            })
        })
    })
}