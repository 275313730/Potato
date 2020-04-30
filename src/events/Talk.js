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
            if (player.space === true && Math.abs(npc.x - player.x) < npc.width / 4 * 3 && dialog.status === 0) {
                player.space = false

                // npc对话开始
                npc.talking = true

                // 传入文本并显示对话框
                dialog.text = npc.textArr[npc.textIndex]
                dialog.show = true

                // 当前文本索引增加
                npc.textIndex++

                break
            }
        } else {
            // 对话中再次按下空格继续对话或对话结束
            if (player.space === true) {
                if (dialog.status < 3) {
                    dialog.status = 1
                } else {
                    // 分段对话
                    if (npc.textIndex < npc.textArr.length) {
                        dialog.status = 0
                        dialog.text = npc.textArr[npc.textIndex]
                        npc.textIndex++
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
            // 重置属性
            dialog.show = false
            npc.textIndex = 0
            npc.talking = false
            player.space = false
        }
    }   
}