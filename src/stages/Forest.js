// modules
import { Stage } from "../../modules/Stage.js";
// sprites
import { backGround } from "../sprites/BackGround.js";
import { mapName } from "../sprites/MapName.js";
import { player } from "../sprites/Player.js";
import { npc } from "../sprites/Npc.js";
import { dialog } from "../sprites/Dialog.js";
// events
import { addNpc } from "../events/AddNpc.js";
import { enterNewStage } from "../events/EnterNewStage.js";
import { shoot } from "../events/Shoot.js";
import { talk } from "../events/Talk.js";
import { noShoot } from "../events/NoShoot.js";

export function forest(mapId, playerX, stickX) {

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
        })

        this.width = this.sprite.find('treeNear').width

        // 载入地图名
        this.sprite.add(mapName(mapId))

        npcs.forEach(n => {
            this.sprite.add(npc(n.id, n.x, n.textArr))
        })

        // 添加玩家
        const newPlayer = player(playerX || 10)
        this.sprite.add(newPlayer)
        this.camera.follow(newPlayer)

        // 添加对话框
        const newDialog = dialog()
        this.sprite.add(newDialog)

        // 根据地图id添加不同的事件
        if (mapId % 2 === 0) {
            this.event.add(shoot)
        } else {
            this.event.add(noShoot, newDialog)
        }

        // 添加事件
        this.event.add(addNpc)
        this.event.add(enterNewStage, mapId)
        this.event.add(talk, newPlayer, newDialog)
    })
}