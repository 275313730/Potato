// Modules
import { Game } from "./modules/Game/Game.js";
import { Stage } from "./modules/Stage/Stage.js";

// Title
import { test } from "./src/stages/Test.js";

// 交互使音频可自动播放
window.addEventListener('keydown', App)

export function App(e) {
    // 移除事件
    if (e.key !== ' ') { return }
    tip.parentNode.removeChild(tip)
    window.removeEventListener('keydown', App)

    // 初始化Game类
    Game.init({
        el: 'app',
        // 设置宽高
        width: 480,
        height: 370,
        // 设置文件路径
        path: {
            image: './src/assets/imgs/',
            audio: './src/assets/audio/'
        }
    })

    // 载入背景图片
    Game.asset.load({
        type: 'image',
        group: 'bg',
        name: 'test',
        url: 'background/test.png'
    })

    // 角色图片数据
    const roles = [
        {
            group: 'player',
            width: 78,
            interval: 8,
            path: 'kingHuman/',
            animations: [
                {
                    url: 'Idle.png',
                    name: 'idle'
                },
                {
                    url: 'Walk.png',
                    name: 'walk'
                },
                {
                    url: 'Attack.png',
                    name: 'attack'
                },
                {
                    url: 'Hit.png',
                    name: 'hit'
                }
            ],
            images: [
                {
                    url: 'Jump.png',
                    name: 'jump'
                },
                {
                    url: 'Fall.png',
                    name: 'fall'
                },
                {
                    url: 'Ground.png',
                    name: 'ground'
                },
            ]
        },
        {
            group: 'pig',
            width: 34,
            interval: 8,
            flip: true,
            path: 'pig/',
            animations: [
                {
                    url: 'Idle.png',
                    name: 'idle'
                },
                {
                    url: 'Walk.png',
                    name: 'walk'
                },
                {
                    url: 'Attack.png',
                    name: 'attack'
                },
                {
                    url: 'Hit.png',
                    name: 'hit'
                },
                {
                    url: 'Dead.png',
                    name: 'dead'
                }
            ],
            images: [
                {
                    url: 'Jump.png',
                    name: 'jump'
                },
                {
                    url: 'Fall.png',
                    name: 'fall'
                },
                {
                    url: 'Ground.png',
                    name: 'ground'
                },
            ]
        },
    ]

    // 载入角色图片
    roles.forEach(role => {
        role.animations.forEach(animation => {
            Game.asset.load({
                type: 'animation',
                group: role.group,
                name: animation.name,
                url: role.path + animation.url,
                width: role.width,
                interval: role.interval,
                flip: role.flip
            })
        })
        role.images.forEach(image => {
            Game.asset.load({
                type: 'image',
                group: role.group,
                name: image.name,
                url: role.path + image.url,
            })
        })
    })

    // 载入音频
    Game.asset.load({
        type: 'audio',
        group: 'music',
        name: 'forest',
        url: 'music/forest.mp3'
    })

    // 调试模式
    Game.test = false

    // 创建场景
    new Stage(test())
}