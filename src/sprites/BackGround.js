import { Sprite } from "../../modules/Sprite.js";

export function backGround(id) {
    return new Sprite({ id }, function () {
        this.draw.image(id)
    })
}