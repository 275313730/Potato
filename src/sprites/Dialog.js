import { Sprite } from "../../modules/Sprite.js";

export function dialog(sw, sh) {
    const options = {
        id: 'dialog',
        x: sw / 2,
        y: sh / 2,

        show: false,
        text: '',
        tempArr: [],
        index: 0,
        typing: 0,// 0=停止,1=进行中,2=等待下一段文字,3=完成本段对话,4=完成所有对话
        count: 0,
        typeText,
        clear
    }

    function draw(ctx) {
        if (this.show) {
            this.typeText()
            ctx.fillStyle = 'grey'
            ctx.centerRect(this.x, this.y, sw / 2, sh / 3)
            ctx.fillStyle = 'white'
            ctx.centerRect(this.x, this.y, sw / 2 - 2, sh / 3 - 2)
            ctx.fillStyle = '#5f3511'
            ctx.centerRect(this.x, this.y, sw / 2 - 4, sh / 3 - 4)
            ctx.fillStyle = 'white'
            ctx.font = '8px pixel'
            ctx.wrapText(this.text, this.x - 55, this.y - 12, sw / 2 - 20, 10)
        } else {
            this.typing = 0
            this.text = ''
            this.clear()
        }
    }

    // 打字效果
    function typeText() {
        switch (this.typing) {
            case 0:
                if (this.tempArr.length === 0) {
                    let tempText = this.text
                    this.text = ''
                    if (tempText.length > 99) {
                        while (tempText.length > 0) {
                            this.tempArr.push(tempText.slice(0, 99))
                            tempText = tempText.slice(99)
                        }
                    } else {
                        this.tempArr.push(tempText)
                    }
                    this.typing = 1
                }
                break
            case 1:
                this.text = this.tempArr[this.index].slice(0, this.count)
                this.count++
                if (this.count > this.tempArr[this.index].length) {
                    this.index++
                    this.count = 0
                    this.typing = 2
                    if (this.index === this.tempArr.length) {
                        this.typing = 3
                        this.clear()
                    }
                }
                break
        }
    }

    function clear() {
        this.index = 0
        this.count = 0
        this.tempArr = []
    }

    return new Sprite(options, function () {
        this.draw.shape(draw)
    })
}