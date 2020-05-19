const Game = Potato.Game
const Stage = Potato.Stage
const Sprite = Potato.Sprite

Game.init({
    el: 'app',
    width: 272,
    height: 160
})

Game.asset.load({
    type: 'image',
    group: 'bgImage',
    name: 'sky',
    url: './img/sky.png'
})

Game.asset.load({
    type: 'animation',
    group: 'player',
    name: 'idle',
    url: './img/idle.png',
    width: 40,
    interval: 16
})

const player = {
    config: {
        id: 'player',
        x: 0,
        y: 0
    },
    created() {
        // 绘制动画
        this.graphics.animation('player', 'idle', true)

        // 调整纵坐标
        this.y = this.game.height - this.height

        // 交互功能
        this.userEvent.add('keydown', key => {
            console.log(0)
            if (key === 'd') {
                this.x += 5
            }
        })
    }
}

const sky = {
    config: {
        id: 'sky',
    },
    created() {
        // 绘制图片
        this.graphics.image('bgImage', 'sky', true)
    }
}

new Stage({
    created() {
        new Sprite(sky)
        new Sprite(player)
    }
})