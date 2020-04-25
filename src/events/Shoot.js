import { Game } from "../../modules/Game.js"
import { bullet } from "../sprites/Bullet.js";

export function shoot() {
    const player = this.unit.find('player'),
        thisBullet = this.unit.find('bullet')

    // 如果玩家的shoot值为true并且bullet不存在时
    if (player.shoot && !thisBullet) {
        player.shoot = false

        // 播放音效
        Game.sound.play('shoot', 0.5)

        // 创建bullet
        this.unit.add(bullet(player))
    }

    // 如果bullet 存在
    if (thisBullet) {
        // bullet的相对x>=游戏宽度或<=0时
        if (thisBullet.relX >= Game.width || thisBullet.relX <= 0) {
            // 删除bullet
            this.unit.del(thisBullet.id)
        }

        // 检测npc是否与bullet接触
        this.unit.travel(u => {
            if (u.type === 'npc' && Math.abs(u.relX + u.width / 2 - thisBullet.relX) <= 10) {
                this.unit.del(thisBullet.id)
                this.unit.del(u.id)
                return false
            }
        })
    }
}