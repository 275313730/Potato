const Game = Potato.Game
const Stage = Potato.Stage
const Sprite = Potato.Sprite

Game.init({
    el: 'app',
    width: 272,
    height: 160
})

const bgs = [
    ['sky', 1],
    ['moun-far', 1],
    ['moun-near', 0.6],
    ['tree-far', 0.3],
    ['tree-near', 0]
]

bgs.forEach(bg => {
    Game.asset.load({
        type: 'image',
        group: 'bgImage',
        name: bg[0],
        url: './img/' + bg[0] + '.png'
    })
})

Game.asset.load({
    type: 'animation',
    group: 'player',
    name: 'idle',
    url: './img/idle.png',
    width: 40,
    interval: 16
})

Game.asset.load({
    type: 'animation',
    group: 'player',
    name: 'walk',
    url: './img/walk.png',
    width: 40,
    interval: 16
})

const player = {
    config: {
        id: 'player',
    },
    data: {
        walking: false
    },
    created() {
        // 绘制动画
        this.graphics.animation('player', 'idle', true)

        // 调整纵坐标
        this.y = this.game.height - this.height

        // 交互功能
        this.userEvent.add('keydown', key => {
            if (key === 'd') {
                this.walking = true
                this.direction = 'right'
                this.graphics.animation('player', 'walk', true)
            }
            if (key === 'a') {
                this.walking = true
                this.direction = 'left'
                this.graphics.animation('player', 'walk', true)
            }
        }, true)
        this.userEvent.add('keyup', key => {
            if ((key === 'd' && this.direction === 'right') || (key === 'a' && this.direction === 'left')) {
                this.walking = false
                this.graphics.animation('player', 'idle', true)
            }
        })

        // 移动事件
        this.event.add(() => {
            if (this.walking === true) {
                if (this.direction === 'right' && this.x < this.stage.width - this.width) {
                    this.x += 1
                } else if (this.direction === 'left' && this.x > 0) {
                    this.x -= 1
                }
            }
        })
    }
}

function background(id, fixed) {
    return {
        config: {
            id,
            fixed
        },
        created() {
            // 绘制图片
            this.graphics.image('bgImage', id, true)
        }
    }
}

new Stage({
    created() {
        bgs.forEach(bg => {
            new Sprite(background(bg[0], bg[1]))
        })

        this.width = 544

        const newPlayer = new Sprite(player)

        this.camera.follow(newPlayer)
    }
})