import { warning } from "../sprites/Warning.js"

export function noShoot() {
    const newWarning = this.unit.find('warning')
    if (!newWarning) {
        this.unit.add(warning())
    } else if (newWarning.count >= 50) {
        this.event.del('noShoot')
        this.unit.del('warning')
    }
}