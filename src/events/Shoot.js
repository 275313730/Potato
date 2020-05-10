import { Game } from "../../modules/Game/Game.js"
import { bullet } from "../sprites/Bullet.js";
import { Sprite } from "../../modules/Sprite/Sprite.js";

export function shoot(player) {
    const thisBullet = Game.unit.find('bullet')
    if (!player) { return }

    // 添加子弹
    if (player.shoot && !thisBullet) {
        player.shoot = false

        // 播放音效
        Game.audio.play('sound', 'audio', 'shoot', 0.5)

        // 创建子弹
        new Sprite(bullet(player))
    }

    // 如果子弹存在
    if (thisBullet) {
        // 子弹的相对横坐标大于游戏宽度或小于等于0时
        if (thisBullet.relX >= Game.width || thisBullet.relX <= 0) {
            // 删除子弹
            Game.unit.del(thisBullet.id)
        }

        // 获取敌人
        const enemies = Game.unit.filter(unit => {
            return unit.type === 'enemy'
        })

        // 检测敌人是否与bullet接触
        for (const key in enemies) {
            const enemy = enemies[key]
            if (!enemy.disabled && this.geometry.intersect(thisBullet, enemy)) {
                // 删除子弹
                Game.unit.del(thisBullet.id)

                // 击中后禁用
                enemy.disabled = true

                // 播放死亡动画
                enemy.graphic.animation(enemy.name, 'death')
                    // 动画完成后销毁精灵
                    .onComplete = () => {
                        Game.unit.del(enemy.id)
                    }

                // 停止遍历
                break
            }
        }
    }
}