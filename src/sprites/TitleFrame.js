import { Game } from "../../modules/Game.js";
import { Sprite } from "../../modules/Sprite.js";

export function titleFrame() {
    const options = {
        id: 'titleFrame',

        title: 'Lost Forest',
        start: 'Start Game',
        egg: `Don't Press!`,
        arrow: '→',
        arrowY: 10,
        selection: 0,
        count: 0,
        reset
    }

    // 绘制
    function draw(ctx) {
        const width = this.game.width,
            height = this.game.height
        
        // drawTitle
        ctx.fillStyle = '#CD2626'
        ctx.font = '18px pixel'
        ctx.centerText(this.title, width / 2, height / 3)

        // drawSelectFrame
        ctx.fillStyle = 'rgba(150,150,150,0.5)'
        ctx.centerRect(this.x, this.y + 15, width / 2, height / 2.7)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.centerRect(this.x, this.y + 15, width / 2 - 2, height / 2.7 - 2)
        ctx.fillStyle = 'rgba(125,100,58,0.5)'
        ctx.centerRect(this.x, this.y + 15, width / 2 - 4, height / 2.7 - 4)

        // drawSelection
        ctx.fillStyle = 'red'
        ctx.font = '10px pixel'
        ctx.centerText(this.start, this.x, this.y + 10)
        ctx.centerText(this.egg, this.x, this.y + 28)

        // drawArrow
        ctx.fillText(this.arrow, this.x - 45, this.y + this.arrowY)
    }

    // 选择
    function select(e) {
        switch (e.key) {
            case 'ArrowDown':
                this.selection = 1
                this.reset()
                break
            case 'ArrowUp':
                this.selection = 0
                this.reset()
                break
            case ' ':
                if (this.selection === 0) {
                    Game.stage.switch('loading', 'forest')
                } else {
                    this.userEvent.delAll()
                    this.egg = 'Suprise!'
                }
                this.reset()
        }
    }

    // 重置
    function reset() {
        Game.sound.play('select', 0.8)
        this.arrow = '→'
        this.count = 0
        this.arrowY = 10 + this.selection * 18
    }

    // 闪烁
    function twinkling() {
        this.count++
        if (this.count >= 25) {
            this.arrow = this.arrow === '' ? '→' : ''
            this.count = 0
        }
    }

    return new Sprite(options, function () {
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.userEvent.add(select, 'keydown', true)
        this.event.add(twinkling)
        this.draw.shape(draw)
    })
}