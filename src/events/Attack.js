import { Game } from "../../modules/Game/Game.js"

export function attack(player) {
    // 如果玩家攻击
    if (player.attacking) {

        const pX = player.x
        const pW = player.width
        const pL = player.offsetLeft

        // 获取敌人
        const enemies = Game.unit.filter(unit => {
            return unit.type === 'enemy'
        })

        // 检测敌人是否被击中
        for (const key in enemies) {
            const enemy = enemies[key]
            const eX = enemy.x
            const eW = enemy.width

            if (!enemy.disabled) {
                if (player.direction === 'right' && (pX + pW - pL < eX || pX > eX + eW)) {
                    continue
                }
                if (player.direction === 'left' && (pX - pL > eX + eW || pX < eX)) {
                    continue
                }
                // 击中后禁用
                enemy.disabled = true

                // 播放死亡动画
                enemy.graphics.animation(enemy.name, 'death')
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