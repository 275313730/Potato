import { Game } from "../../modules/Game/Game.js"
import { bullet } from "../sprites/Bullet.js";

export function shoot() {
    const unit = Game.unit
    const player = unit.find('player')
    const thisBullet = unit.find('bullet')
    if (!player) { return }

    // 添加子弹
    if (player.shoot && !thisBullet) {
        player.shoot = false

        // 创建子弹
        unit.add(bullet(player))
    }

    // 如果子弹存在
    if (thisBullet) {
        // 子弹的相对横坐标大于游戏宽度或小于等于0时
        if (thisBullet.relX >= Game.width || thisBullet.relX <= 0) {
            // 删除子弹
            unit.del(thisBullet.id)
        }

        // 获取敌人
        const enemies = unit.filter(sprite => {
            return sprite.type === 'enemy'
        })

        // 检测敌人是否与bullet接触
        for (const key in enemies) {
            const enemy = enemies[key]
            if (!enemy.disabled && this.geometry.intersect(thisBullet, enemy)) {
                // 删除子弹
                unit.del(thisBullet.id)

                // 击中后禁用
                enemy.disabled = true

                // 播放死亡动画
                enemy.graphics.animation('heyna', 'death')
                    // 动画完成后销毁精灵
                    .onComplete = () => {
                        unit.del(enemy.id)
                    }

                // 停止遍历
                break
            }
        }
    }
}