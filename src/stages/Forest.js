// modules
import { Stage } from "../../modules/Stage.js";
// sprites
import { backGround } from "../sprites/BackGround.js";
import { mapName } from "../sprites/MapName.js";
import { player } from "../sprites/Player.js";
import { npc } from "../sprites/Npc.js";
import { enemy } from "../sprites/Enemy.js";
import { dialog } from "../sprites/Dialog.js";
import { particle } from "../sprites/Particle.js";
// events
import { addNpc } from "../events/AddNpc.js";
import { enterNewStage } from "../events/EnterNewStage.js";
import { shoot } from "../events/Shoot.js";
import { talk } from "../events/Talk.js";
import { warning } from "../events/Warning.js";

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
            textArr: [`oldman: "Try to press 'Esc', you can create a new sprite."`,
                `You: "I will try."`]
        }
    ]

    return new Stage({ id: mapId }, function () {
        // 载入背景
        bgs.forEach(bg => {
            this.sprite.add(backGround(bg.id, bg.fixed))
            if (bg.fixed === 0) {
                this.width = this.sprite.find(bg.id).width
            }
        })

        // 载入地图名
        this.sprite.add(mapName(mapId))

        // 载入玩家
        const newPlayer = player(playerX || 10)
        this.sprite.add(newPlayer)
        this.camera.follow(newPlayer)

        if (mapId % 2 === 0) {
            // 载入npc
            npcs.forEach(n => {
                this.sprite.add(npc(n.id, n.x, n.textArr))
            })
        } else {
            // 载入敌人
            for (let i = 0; i < 3; i++) {
                this.sprite.add(enemy('hyena', i, newPlayer))
            }
        }

        // 载入对话框
        this.sprite.add(dialog())

        // 载入粒子精灵
        this.sprite.add(particle('test', 'twinkling', 100, 50))

        // 载入事件
        this.event.add(enterNewStage, mapId)
        this.event.add(talk, newPlayer)

        // 根据地图id载入不同的事件
        if (mapId % 2 === 1) {
            this.event.add(shoot)
            this.event.once(warning)
        } else {
            this.event.add(addNpc)
        }
    })
}