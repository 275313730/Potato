// modules
import { Game } from "../../modules/Game.js";
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

export function forest(mapId, playerX, stickX) {
    const bgs = ['sky', 'mounFar', 'mounNear', 'treeFar', 'treeNear']

    const npcs = [
        {
            id: 'woman',
            x: 130,
            y: 48,
            textArr: [`Woman: "Welcome to the example game."`, `You: "......"`]
        },
        {
            id: 'oldman',
            x: 280,
            y: 45,
            textArr: [`oldman: "Try to press 'Esc', you can create a new sprite."`,
                `You: "I will try."`]
        }
    ]

    return new Stage({}, function () {
        // 载入背景
        bgs.forEach(bg => {
            this.unit.add(backGround(bg))
        })

        // 载入地图名
        this.unit.add(mapName(this.width, mapId))

        // 校正背景位置
        const stick = this.unit.find('treeNear')
        stick.x = stickX || 0

        // 根据地图id判断是否添加单位和事件
        if (mapId % 2 === 0) {
            // 添加NPC
            npcs.forEach(n => {
                this.unit.add(npc(n.id, n.x, n.y, this.height, Game.animations[n.id], n.textArr, stick))
            })
            // 添加事件
            this.event.add(addNpc)
        }

        // 添加玩家
        const newPlayer = player(stick, this.width, this.height, Game.animations.player, playerX || 10)
        this.unit.add(newPlayer)

        // 添加对话框
        const newDialog = dialog(this.width, this.height)
        this.unit.add(newDialog)

        // 添加事件
        this.event.add(enterNewStage, mapId)
        this.event.add(shoot, stick)
        this.event.add(talk, newPlayer, newDialog)
    })
}