import { Game } from "../../modules/Game/Game.js"

export function hit(player) {
    let cal = false
    return function () {
        if (player.attackStatus === 2 && !cal) {
            cal = true
            const pigs = Game.unit.filter(unit => { return unit.type === 'enemy' })
            for (const key in pigs) {
                const pig = pigs[key]
                if (this.geometry.distance('y', player, pig) < 30 &&
                    this.geometry.distance('x', player, pig) < 20 &&
                    this.geometry.distance('x', player, pig) > 0) {
                    if ((this.geometry.onLeft(player, pig) && player.direction === 'right') ||
                        (this.geometry.onRight(player, pig) && player.direction === 'left')) {
                        pig.hit()
                    }
                }
            }
        }
        if (player.attackStatus === 0) {
            cal = false
        }
    }
}