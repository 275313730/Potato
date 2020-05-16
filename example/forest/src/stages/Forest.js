// modules
import { Sprite } from "../../modules/Sprite/Sprite.js";

// sprites
import { backGround } from "../sprites/BackGround.js";
import { player } from "../sprites/Player.js";
import { npc } from "../sprites/Npc.js";
import { dialog } from "../sprites/Dialog.js";
import { particle } from "../sprites/Particle.js";

// events
import { addNpc } from "../events/AddNpc.js";
import { talk } from "../events/Talk.js";

export function forest(mapId, playerX) {
    // 背景分层
    const bgs = [
        {
            id: 'sky',
            fixed: 1
        },
        {
            id: 'mounFar',
            fixed: 1
        },
        {
            id: 'mounNear',
            fixed: 0.7
        },
        {
            id: 'treeFar',
            fixed: 0.4
        },
        {
            id: 'treeNear',
            fixed: 0
        }]

    const npcs = [
        {
            id: 'woman',
            x: 130,
            textArr: [`Woman: "Welcome to the example game."`, `You: "......"`]
        },
        {
            id: 'oldman',
            x: 280,
            top: 7,
            textArr: [`oldman: "Try to press 'Esc', you can create a new sprite."`,
                `You: "I will try."`]
        }
    ]

    return {
        created() {
            // 载入背景图片
            bgs.forEach(bg => {
                const unit = new Sprite(backGround(bg.id, bg.fixed))
                if (bg.fixed === 0) {
                    this.width = unit.width
                }
            })

            // 载入玩家
            const newPlayer = new Sprite(player(playerX || 10))
            this.camera.follow(newPlayer)

            // 载入npc
            npcs.forEach(n => {
                new Sprite(npc(n.id, n.x, n.top, n.textArr))
            })

            // 载入对话框
            const newDialog = new Sprite(dialog())

            // 载入粒子精灵
            new Sprite(particle('test', 'twinkling', 100, 50))

            // 载入事件
            this.event.add(addNpc, newPlayer)
            this.event.add(talk, newPlayer, newDialog)
        }
    }
}