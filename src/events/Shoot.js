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

        // 获取敌人
        const enemies = this.sprite.filter(sprite => {
            return sprite.type === 'enemy'
        })

        // 检测敌人是否与bullet接触
        for (const key in enemies) {
            const enemy = enemies[key]
            if (!enemy.disabled && this.geometry.intersect(thisBullet, enemy)) {
                console.log(true)
                // 删除子弹
                this.sprite.del(thisBullet.id)

                // 击中后禁用
                enemy.disabled = true

                // 播放死亡动画
                enemy.draw.animation(enemy.name, 'death')
                    // 动画完成后销毁精灵
                    .onComplete = () => {
                        this.sprite.del(enemy.id)
                    }

                // 停止遍历
                break
            }
        }
    }
}