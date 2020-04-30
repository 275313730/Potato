export function talk(player) {
    const dialog = this.sprite.find('dialog')
    const npcs = this.sprite.filter(sprite => {
        return sprite.type === 'npc'
    })

    for (const key in npcs) {
        const npc = npcs[key]

        // 判断位置来修改npc方向
        if (npc.moveStatus < 2) {
            if (npc.x < player.x) {
                npc.direction = 'right'
            } else {
                npc.direction = 'left'
            }
        }

        // 判断是否对话中
        if (!npc.talking) {
            // 在一定范围内按下空格对话开始
            if (player.space === true && Math.abs(npc.x - player.x) < npc.width / 4 * 3 && dialog.typing === 0) {
                player.space = false
                npc.talking = true
                dialog.text = npc.textArr[npc.textCount]
                dialog.show = true
                npc.textCount++
                break
            }
        } else {
            // 对话中再次按下空格继续对话或对话结束
            if (player.space === true) {
                if (dialog.typing < 3) {
                    dialog.typing = 1
                } else {
                    // 分段对话
                    if (npc.textCount < npc.textArr.length) {
                        dialog.typing = 0
                        dialog.text = npc.textArr[npc.textCount]
                        npc.textCount++
                    } else {
                        talkStop()
                    }
                }
                break
            }

            // 离开一定范围对话直接结束对话
            if (Math.abs(npc.x - player.x) > npc.width / 4 * 3) {
                talkStop()
                break
            }
        }

        // 对话停止
        function talkStop() {
            dialog.show = false
            npc.textCount = 0
            npc.talking = false
            player.space = false
        }
    }   
}