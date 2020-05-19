import { Stage } from "../../core/Potato.js";
import { forest } from "../stages/Forest.js";

export function titleFrame() {
    return {
        config: {
            id: 'titleFrame',
        },
        data: {
            title: 'Lost Forest',
            start: 'Start Game',
            egg: `Don't Press!`,
            arrow: '→',
            arrowY: 10,
            selection: 0,
            count: 0,
        },
        methods: {
            // 重置
            reset() {
                this.arrow = '→'
                this.count = 0
                this.arrowY = 10 + this.selection * 18
                this.audio.play({
                    type: 'sound',
                    group: 'audio',
                    name: 'select'
                })
            }
        },
        created() {
            this.x = this.game.width / 2
            this.y = this.game.height / 2
            this.userEvent.add('keydown', select, true)
            this.event.add(twinkling)
            this.graphics.draw(draw)
        }
    }

    // 绘制
    function draw(ctx) {
        const w = this.game.width
        const h = this.game.height

        // drawTitle
        ctx.fillStyle = '#CD2626'
        ctx.font = '18px pixel'
        ctx.centerText(this.title, w / 2, h / 3)

        // drawSelectFrame
        ctx.fillStyle = 'rgba(150,150,150,0.5)'
        ctx.centerRect(this.x, this.y + 15, w / 2, h / 2.7)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.centerRect(this.x, this.y + 15, w / 2 - 2, h / 2.7 - 2)
        ctx.fillStyle = 'rgba(125,100,58,0.5)'
        ctx.centerRect(this.x, this.y + 15, w / 2 - 4, h / 2.7 - 4)

        // drawSelection
        ctx.fillStyle = 'red'
        ctx.font = '10px pixel'
        ctx.centerText(this.start, this.x, this.y + 10)
        ctx.centerText(this.egg, this.x, this.y + 28)

        // drawArrow
        ctx.fillText(this.arrow, this.x - 45, this.y + this.arrowY)
    }

    // 选择
    function select(key) {
        switch (key) {
            case 'ArrowDown':
                this.selection = 1
                this.reset()
                break
            case 'ArrowUp':
                this.selection = 0
                this.reset()
                break
            case ' ':
                this.reset()
                if (this.selection === 0) {
                    new Stage(forest(0))
                } else {
                    this.egg = ''
                }
                break
        }
    }

    // 闪烁
    function twinkling() {
        this.count++
        if (this.count >= 25) {
            this.arrow = this.arrow === '' ? '→' : ''
            this.count = 0
        }
    }
}