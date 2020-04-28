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
            width: 40,
            animations: [
                {
                    url: 'spritesheets/bearded-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/bearded-walk.png',
                    name: 'walk'
                }
            ]
        },
        {
            id: 'woman',
            width: 37,
            animations: [
                {
                    url: 'spritesheets/woman-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/woman-walk.png',
                    name: 'walk'
                }
            ]
        },
        {
            id: 'oldman',
            width: 34,
            animations: [
                {
                    url: 'spritesheets/oldman-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/oldman-walk.png',
                    name: 'walk'
                }
            ]
        },
        {
            id: 'hatman',
            width: 39,
            animations: [
                {
                    url: 'spritesheets/hat-man-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/hat-man-walk.png',
                    name: 'walk'
                }
            ]
        },
        {
            id: 'hyena',
            width: 48,
            interval: 7,
            animations: [
                {
                    url: 'hyena/hyena-idle.png',
                    name: 'idle'
                },
                {
                    url: 'hyena/hyena-walk.png',
                    name: 'walk'
                },
                {
                    url: 'hyena/hyena-death.png',
                    name: 'death'
                },
                {
                    url: 'hyena/hyena-attack.png',
                    name: 'attack'
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

    // 初始化Game类
    Game.init({
        el: 'app',
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
    })

    // 载入图片
    images.forEach(item => {
        Game.load.image(item.id, item.url)
    })

    // 载入动画
    roles.forEach(role => {
        if (role.id === 'hyena') {
            Game.animation.role(role.id, role.width, role.interval, true)
        } else {
            Game.animation.role(role.id, role.width)
        }
        role.animations.forEach(animation => {
            Game.load.animation(role.id, animation.name, animation.url)
        })
    })

    // 载入音频
    audios.forEach(audio => {
        Game.load.audio(audio.id, audio.url)
    })

    Game.test = true

    // 创建场景
    Game.stage.switch('forest', 1)
}