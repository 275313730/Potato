import { Sprite } from "../../modules/Sprite.js";

export function particle(id, name, x, y) {
    const options = {
        id,
        x,
        y,
        size: 0.25,
        fixed: 1,
    }

    return new Sprite(options, function () {
        this.draw.particle(name, 40, [0, 1])
    })
}