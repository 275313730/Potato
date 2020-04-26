export function talk(player, dialog) {
    this.sprite.travel(sprite => {
        if (sprite.type !== 'npc') { return }

        // 判断位置来修改npc方向
        if (sprite.moveStatus < 2) {
            if (sprite.x < player.x) {
                sprite.direction = 'right'
            } else {
                sprite.direction = 'left'
            }
        }

        // 判断是否对话中
        if (!sprite.talking) {
            // 在一定范围内按下空格对话开始
            if (player.space === true && Math.abs(sprite.x - player.x) < sprite.width / 4 * 3 && dialog.typing === 0) {
                player.space = false
                sprite.talking = true
                dialog.text = sprite.textArr[sprite.textCount]
                dialog.show = true
                sprite.textCount++
                return false
            }
        } else {
            // 对话中再次按下空格继续对话或对话结束
            if (player.space === true) {
                if (dialog.typing < 3) {
                    dialog.typing = 1
                } else {
                    // 分段对话
                    if (sprite.textCount < sprite.textArr.length) {
                        dialog.typing = 0
                        dialog.text = sprite.textArr[sprite.textCount]
                        sprite.textCount++
                    } else {
                        talkStop(player, dialog)
                    }
                }
                return false
            }

            // 离开一定范围对话直接结束对话
            if (Math.abs(sprite.x - player.x) > sprite.width / 4 * 3) {
                talkStop()
                return false
            }
        }

        // 对话停止
        function talkStop() {
            dialog.show = false
            sprite.textCount = 0
            sprite.talking = false
            player.space = false
        }
    })
}