import { Sprite } from "../../modules/Sprite.js";

export function backGround(id, fixed) {
    const options = {
        id,
        fixed: fixed || 0
    }

    return new Sprite(options, function () {
        this.draw.image(id)
    })
}