import { Game } from "../../modules/Game.js"
import { bullet } from "../sprites/Bullet.js";

export function shoot() {
    const player = this.sprite.find('player'),
        thisBullet = this.sprite.find('bullet')

    // 如果玩家的shoot值为true并且bullet不存在时
    if (player.shoot && !thisBullet) {
        player.shoot = false

        // 播放音效
        Game.sound.play('shoot', 0.5)

        // 创建bullet
        this.sprite.add(bullet(player))
    }

    // 如果bullet存在
    if (thisBullet) {
        // bullet的相对x>=游戏宽度或<=0时
        if (thisBullet.relX >= Game.width || thisBullet.relX <= 0) {
            // 删除bullet
            this.sprite.del(thisBullet.id)
        }

        // 检测npc是否与bullet接触
        this.sprite.travel(sp => {
            if (sp.type === 'npc' && Math.abs(sp.relX + sp.width / 2 - thisBullet.relX) <= 10) {
                this.sprite.del(thisBullet.id)
                if (sp.id === 'hyena') {
                    if (sp.disabled) { return }
                    sp.disabled = true
                    sp.draw.animation(sp.id, 'death')
                        .onComplete = () => {
                            this.sprite.del(sp.id)
                        }
                } else {
                    this.sprite.del(sp.id)
                }
                return false
            }
        })
    }
}