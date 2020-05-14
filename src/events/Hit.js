export function hit(player, pigs) {
    let cal = false
    return function () {
        if (player.attackStatus === 2 && !cal) {
            cal = true
            for (const key in pigs) {
                const pig = pigs[key]
                if (this.geometry.distance('y', player, pig) < 30 &&
                    this.geometry.distance('x', player, pig) < 20 &&
                    this.geometry.distance('x', player, pig) > 0) {
                    pig.hit()
                }
            }
        }
        if (player.attackStatus === 0) {
            cal = false
        }
    }
}