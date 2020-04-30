import { Sprite } from "../../modules/Sprite.js";

export function dialog() {
    const options = {
        id: 'dialog',

        show: false,
        text: '',
        tempArr: [],
        index: 0, // 索引
        status: 0,  // 0=停止,1=进行中,2=等待下一段文字,3=完成本段对话,4=完成所有对话
        count: 0,   // 字数
        typeText,
        clear
    }

    // 绘制
    function draw(ctx) {
        const gw = this.game.width,
            gh = this.game.height
        if (this.show) {
            this.typeText()
            ctx.fillStyle = 'grey'
            ctx.centerRect(this.x, this.y, gw / 2, gh / 3)
            ctx.fillStyle = 'white'
            ctx.centerRect(this.x, this.y, gw / 2 - 2, gh / 3 - 2)
            ctx.fillStyle = '#5f3511'
            ctx.centerRect(this.x, this.y, gw / 2 - 4, gh / 3 - 4)
            ctx.fillStyle = 'white'
            ctx.font = '8px pixel'
            ctx.wrapText(this.text, this.x - 55, this.y - 12, gw / 2 - 20, 10)
        } else {
            this.status = 0
            this.text = ''
            this.clear()
        }
    }

    // 打字效果
    function typeText() {
        switch (this.status) {
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
                    this.status = 1
                }
                break
            case 1:
                this.text = this.tempArr[this.index].slice(0, this.count)
                this.count++
                if (this.count > this.tempArr[this.index].length) {
                    this.index++
                    this.count = 0
                    this.status = 2
                    if (this.index === this.tempArr.length) {
                        this.status = 3
                        this.clear()
                    }
                }
                break
        }
    }

    // 清除
    function clear() {
        this.index = 0
        this.count = 0
        this.tempArr = []
    }

    return new Sprite(options, function () {
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.draw.shape(draw)
    })
}