// modules
import { Sprite } from "../../modules/Sprite/Sprite.js";

// sprites
import { bgImg } from "../sprites/BgImg.js";
import { bgMusic } from "../sprites/BgMusic.js";
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
            // 创建背景音乐
            new Sprite(bgMusic())

            // 创建背景图片
            const newBG = new Sprite(bgImg('test'))
            this.width = newBG.width
            this.height = newBG.height

            // 创建阻挡物
            let blocks = []
            const blocksData = [
                [8, 0, 3, 5, 1],
                [9, 5, 3, 1, 1],
                [6, 5, 4, 1, 7],
                [8, 6, 11, 5, 1],
                [9, 11, 11, 1, 1],
                [6, 11, 11, 1, 4],
                [3, 11, 15, 1, 1],
                [2, 0, 15, 11, 1],
                [8, 0, 19, 20, 1]
            ]
            blocksData.forEach(data => {
                blocks.push(new Sprite(block('block', data)))
            })


            // 创建平台
            const flatsData = [
                [7, 4, 3],
                [11, 5, 1],
                [9, 7, 3],
                [7, 9, 3],
                [13, 12, 1],
                [13, 14, 1],
                [13, 16, 3],
                [17, 17, 1]
            ]
            
            flatsData.forEach(data => {
                blocks.push(new Sprite(block('flat', data)))
            })

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