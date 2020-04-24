import { warning } from "../sprites/Warning.js"

export function noShoot() {
    const newWarning = this.unit.find('warning')
    if (!newWarning) {
        this.unit.add(warning())
        let player = this.unit.find('player')
        player.disabled = true
        player.stop()
        setTimeout(() => {
            let count = 0,
                timer = setInterval(() => {
                    count++
                    if (count <= 95) {
                        player.stick.x -= 1.5
                    } else {
                        player.stick.x += 1.5
                    }
                }, 16);
            setTimeout(() => {
                clearInterval(timer)
                player.stick.x = 0
                player.disabled = false
                this.event.del('noShoot')
                this.unit.del('warning')
            }, 3200)
        }, 500);


    }
}