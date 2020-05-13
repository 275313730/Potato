// modules
import { Sprite } from "../../modules/Sprite/Sprite.js";

// sprites
import { backGround } from "../sprites/BackGround.js";
import { player } from "../sprites/Player.js";
import { block } from "../sprites/Block.js";

// events
import { collie } from "../events/Collie.js";
import { gravity } from "../events/Gravity.js";
import { pig } from "../sprites/Pig.js";
import { hit } from "../events/Hit.js";
import { deadCheck } from "../events/DeadCheck.js";

export function test() {
    return {
        created() {
            // 创建背景
            const newBG = new Sprite(backGround('test'))
            this.width = newBG.width
            this.height = newBG.height

            // 创建阻挡物
            let blocks = []
            blocks.push(new Sprite(block(8, 0, 96, 5, 1)))
            blocks.push(new Sprite(block(9, 160, 96, 1, 1)))
            blocks.push(new Sprite(block(6, 160, 128, 1, 7)))
            blocks.push(new Sprite(block(8, 192, 352, 5, 1)))
            blocks.push(new Sprite(block(9, 352, 352, 1, 1)))
            blocks.push(new Sprite(block(6, 352, 352, 1, 4)))
            blocks.push(new Sprite(block(3, 352, 480, 1, 1)))
            blocks.push(new Sprite(block(2, 0, 480, 11, 1)))
            blocks.push(new Sprite(block(8, 0, 608, 20, 1)))

            // 创建玩家
            const newPlayer = new Sprite(player())
            this.camera.follow(newPlayer)

            const pigs = []
            pigs.push(new Sprite(pig('pig1', 150, 78)))

            this.event.add(collie, newPlayer, blocks)
            this.event.add(gravity, newPlayer, blocks)
            this.event.add(hit(newPlayer, pigs))
            this.event.add(deadCheck)
        }
    }
}