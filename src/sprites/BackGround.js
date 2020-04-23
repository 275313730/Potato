import { Sprite } from "../../modules/Sprite.js";

export function backGround(id) {
    const options = {
        id,
        x: 0,
        y: 0,

    }

    return new Sprite(options, function () {
        this.draw.image(id)
    })
}