export function talk(player, dialog) {
    this.unit.travel(unit => {
        if (unit.type !== 'npc') { return }

        // 判断位置来修改npc方向
        if (unit.moveStatus < 2) {
            if (unit.x < player.x) {
                unit.direction = 'right'
            } else {
                unit.direction = 'left'
            }
        }

        // 判断是否对话中
        if (!unit.talking) {
            // 在一定范围内按下空格对话开始
            if (player.space === true && Math.abs(unit.x - player.x) < unit.width / 4 * 3 && dialog.typing === 0) {
                player.space = false
                unit.talking = true
                dialog.text = unit.textArr[unit.textCount]
                dialog.show = true
                unit.textCount++
                return false
            }
        } else {
            // 对话中再次按下空格继续对话或对话结束
            if (player.space === true) {
                if (dialog.typing < 3) {
                    dialog.typing = 1
                } else {
                    // 分段对话
                    if (unit.textCount < unit.textArr.length) {
                        dialog.typing = 0
                        dialog.text = unit.textArr[unit.textCount]
                        unit.textCount++
                    } else {
                        talkStop(player, dialog)
                    }
                }
                return false
            }

            // 离开一定范围对话直接结束对话
            if (Math.abs(unit.x - player.x) > unit.width / 4 * 3) {
                talkStop()
                return false
            }
        }

        // 对话停止
        function talkStop() {
            dialog.show = false
            unit.textCount = 0
            unit.talking = false
            player.space = false
        }
    })
}