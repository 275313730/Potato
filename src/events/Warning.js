import { text } from "../sprites/Text.js"

export function warning() {
    // 禁用所有单位
    this.sprite.travel(sprite => {
        sprite.disabled = true
    })

    // 暂停玩家
    const player = this.sprite.find('player')
    player.stop()

    // 添加warning
    this.sprite.add(text())

    this.camera.move(200, 0, 2000, () => {
        this.camera.move(-200, 0, 2000, () => {
            this.sprite.del('text')
            this.sprite.travel(sprite => {
                sprite.disabled = false
            })
            this.camera.follow(player)
        })
    })
}