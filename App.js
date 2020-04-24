// modules
import { Game } from "./modules/Game.js";
// stages
import { title } from "./src/stages/Title.js";
import { forest } from "./src/stages/Forest.js";

window.addEventListener('keydown', App)
export function App(e) {
    if (e.key !== ' ') {
        return
    }

    window.removeEventListener('keydown', App)

    const images = [
        {
            id: 'sky',
            url: 'background/sky.png',
        },
        {
            id: 'mounFar',
            url: 'background/moun-far.png',
        },
        {
            id: 'mounNear',
            url: 'background/moun-near.png',
        },
        {
            id: 'treeFar',
            url: 'background/tree-far.png',
        },
        {
            id: 'treeNear',
            url: 'background/tree-near.png',
        }
    ]

    const roles = [
        {
            id: 'player',
            animations: [
                {
                    url: 'bearded-idle/bearded-idle-',
                    length: 5,
                    name: 'stay'
                },
                {
                    url: 'bearded-walk/bearded-walk-',
                    length: 5,
                    name: 'walk'
                }
            ]
        },
        {
            id: 'woman',
            animations: [
                {
                    url: 'woman-idle/woman-idle-',
                    length: 7,
                    name: 'stay'
                },
                {
                    url: 'woman-walk/woman-walk-',
                    length: 6,
                    name: 'walk'
                }
            ]
        },
        {
            id: 'oldman',
            animations: [
                {
                    url: 'oldman-idle/oldman-idle-',
                    length: 8,
                    name: 'stay'
                },
                {
                    url: 'oldman-walk/oldman-walk-',
                    length: 12,
                    name: 'walk'
                }
            ]
        },
        {
            id: 'hatman',
            animations: [
                {
                    url: 'hat-man-idle/hat-man-idle-',
                    length: 4,
                    name: 'stay'
                },
                {
                    url: 'hat-man-walk/hat-man-walk-',
                    length: 6,
                    name: 'walk'
                }
            ]
        }
    ]

    const audios = [
        {
            id: 'forest',
            url: 'music/forest.mp3'
        },
        {
            id: 'select',
            url: 'sound/select.mp3'
        },
        {
            id: 'shoot',
            url: 'sound/shoot.mp3'
        }
    ]

    const options = {
        // 设置宽高
        width: 272,
        height: 160,
        // 设置文件路径
        path: {
            image: 'src/assets/imgs/',
            audio: 'src/assets/audio/'
        },
        // 载入场景
        stages: {
            title,
            forest
        }
    }

    // 创建游戏实例
    new Game(options, function () {
        // 载入图片
        images.forEach(item => {
            this.load.image(item.id, item.url)
        })

        // 载入动画
        roles.forEach(role => {
            role.animations.forEach(animation => {
                this.load.animation(role.id, animation.name, animation.url, animation.length)
            })
        })

        // 载入音频
        audios.forEach(audio => {
            this.load.audio(audio.id, audio.url)
        })

        // 创建场景
        this.start('title')
    })


}