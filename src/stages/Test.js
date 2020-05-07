// modules
import { Stage } from "../../modules/Stage.js";

// sprites
import { player } from "../sprites/Player.js";

export function test() {
    return new Stage({ id: "test" }, function () {
        // 载入玩家
        const newPlayer = this.sprite.add(player())
        this.camera.follow(newPlayer)
    })
}