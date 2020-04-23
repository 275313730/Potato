import { Game } from "../../modules/Game.js";
import { bullet } from "../sprites/Bullet.js";


export function shoot(stick) {
    const player = this.unit.find('player')
    if (!player) { return }

    const thisBullet = this.unit.find('bullet')

    if (player.shoot && !thisBullet) {
        Game.sound.play('shoot', 0.5)
        player.shoot = false
        this.unit.add(bullet(player, stick))
    }

    if (thisBullet) {
        if (thisBullet.relX >= this.width || thisBullet.relX <= 0) {
            this.unit.del(thisBullet.id)
        }
        this.unit.travel(u => {
            if (thisBullet) {
                if (u.type === 'npc') {
                    if (Math.abs(u.relX + u.width / 2 - thisBullet.relX) <= 10) {
                        this.unit.del(thisBullet.id)
                        this.unit.del(u.id)
                    }
                }
            }
        })
    }
}