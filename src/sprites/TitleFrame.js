import { Sprite } from "../../modules/Sprite.js";
import { Game } from "../../modules/Game.js";

export function titleFrame(sw, sh) {
    const options = {
        id: 'titleFrame',
        x: sw / 2,
        y: sh / 2,

        title: 'Lost Forest',
        start: 'Start Game',
        egg: `Don't Click`,
        arrow: '→',
        arrowY: 10,
        selection: 0,
        count: 0,
        reset
    }

    function draw(ctx) {
        // drawTitle
        ctx.fillStyle = '#CD2626'
        ctx.font = '18px pixel'
        ctx.centerText(this.title, sw / 2, sh / 3)

        // drawSelectFrame
        ctx.fillStyle = 'rgba(150,150,150,0.5)'
        ctx.centerRect(this.x, this.y + 15, sw / 2, sh / 2.7)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.centerRect(this.x, this.y + 15, sw / 2 - 2, sh / 2.7 - 2)
        ctx.fillStyle = 'rgba(125,100,58,0.5)'
        ctx.centerRect(this.x, this.y + 15, sw / 2 - 4, sh / 2.7 - 4)

        // drawSelection
        ctx.fillStyle = 'red'
        ctx.font = '10px pixel'
        ctx.centerText(this.start, this.x, this.y + 10)
        ctx.centerText(this.egg, this.x, this.y + 28)

        // drawArrow
        ctx.fillText(this.arrow, this.x - 45, this.y + this.arrowY)
    }

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
                    Game.stage.switch('forest', 0)
                } else {
                    this.userEvent.delAll()
                    this.egg = 'Suprise!'
                }
                this.reset()
        }
    }

    function reset() {
        Game.sound.play('select', 0.8)
        this.arrow = '→'
        this.count = 0
        this.arrowY = 10 + this.selection * 18
    }

    function twinkling() {
        if (this.count < 25) {
            this.count++
            return
        }
        this.arrow = this.arrow === '' ? '→' : ''
        this.count = 0
    }

    return new Sprite(options, function () {
        this.userEvent.add(select, 'keydown', true)
        this.event.add(twinkling)
        this.draw.shape(draw)
    })
}