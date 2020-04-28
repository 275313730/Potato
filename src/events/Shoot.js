import { Game } from "../../modules/Game.js"
import { bullet } from "../sprites/Bullet.js";

export function shoot() {
    const player = this.sprite.find('player'),
        thisBullet = this.sprite.find('bullet')
    if (!player) { return }

    // 添加子弹
    if (player.shoot && !thisBullet) {
        player.shoot = false

        // 播放音效
        Game.sound.play('shoot', 0.5)

        // 创建子弹
        this.sprite.add(bullet(player))
    }

    // 如果子弹存在
    if (thisBullet) {
        // 子弹的相对横坐标大于游戏宽度或小于等于0时
        if (thisBullet.relX >= Game.width || thisBullet.relX <= 0) {
            // 删除子弹
            this.sprite.del(thisBullet.id)
        }

        // 检测敌人是否与bullet接触
        this.sprite.travel(sp => {
            if (!sp.disabled && sp.type === 'enemy' && Math.abs(sp.relX + sp.width / 2 - thisBullet.relX) <= 10) {
                // 删除子弹
                this.sprite.del(thisBullet.id)

                // 击中后禁用
                sp.disabled = true

                // 播放死亡动画
                sp.draw.animation(sp.name, 'death')
                    // 动画完成后销毁精灵
                    .onComplete = () => {
                        this.sprite.del(sp.id)
                    }
                
                // 返回'stop'来停止遍历
                return 'stop'
            }
        })
    }
}