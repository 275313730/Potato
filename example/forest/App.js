// modules
import { Game } from "./modules/Game/Game.js";
import { Stage } from "./modules/Stage/Stage.js";

// stages
import { title } from "./src/stages/Title.js";

// 交互使音频可自动播放
window.addEventListener('keydown', App)

export function App(e) {
    // 移除事件
    if (e.key !== ' ') { return }
    tip.remove()
    window.removeEventListener('keydown', App)

    // 初始化Game类
    Game.init({
        el: 'app',
        // 设置宽高
        width: 272,
        height: 160,
        // 设置文件路径
        path: {
            image: './src/assets/imgs/',
            audio: './src/assets/audio/'
        },
    })

    // 载入背景图片
    const images = [
        {
            name: 'sky',
            url: 'background/sky.png',
        },
        {
            name: 'mounFar',
            url: 'background/moun-far.png',
        },
        {
            name: 'mounNear',
            url: 'background/moun-near.png',
        },
        {
            name: 'treeFar',
            url: 'background/tree-far.png',
        },
        {
            name: 'treeNear',
            url: 'background/tree-near.png',
        }
    ]
    images.forEach(image => {
        Game.asset.load({
            type: 'image',
            group: 'bg',
            name: image.name,
            url: image.url
        })
    })

    // 载入角色图片
    const roles = [
        {
            id: 'player',
            width: 40,
            interval: 16,
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
            interval: 16,
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
            interval: 16,
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
            interval: 10,
            flip: true,
            animations: [
                {
                    url: 'spritesheets/hyena-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/hyena-walk.png',
                    name: 'walk'
                },
                {
                    url: 'spritesheets/hyena-death.png',
                    name: 'death'
                },
                {
                    url: 'spritesheets/hyena-attack.png',
                    name: 'attack'
                }
            ]
        }
    ]
    roles.forEach(role => {
        role.animations.forEach(animation => {
            Game.asset.load({
                type: 'animation',
                group: role.id,
                name: animation.name,
                width: role.width,
                interval: role.interval,
                flip: role.flip,
                url: animation.url
            })
        })
    })

    // 载入粒子图片
    Game.asset.load({
        type: 'image',
        group: 'particle',
        name: 'twinkling',
        url: 'particle/twinkling.png'
    })

    // 载入音频
    const audios = [
        {
            name: 'forest',
            url: 'music/forest.mp3'
        },
        {
            name: 'select',
            url: 'sound/select.mp3'
        },
    ]
    audios.forEach(audio => {
        Game.asset.load({
            type: 'audio',
            group: 'audio',
            name: audio.name,
            url: audio.url
        })
    })

    // 调试模式
    Game.test = false

    // 创建场景
    new Stage(title())
}