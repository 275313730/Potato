import { Sprite } from "../../modules/Sprite.js";

export function particle(id, name, x, y) {
    const options = {
        id,
        x,
        y
    }

    return new Sprite(options, function () {
        this.draw.particle({
            name,
            size: 0.25,
            alphaRange: [0, 1],
            interval: 60
        })
    })
}