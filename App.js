// Modules
import { Game } from "./modules/Game/Game.js";

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

    // 背景图片
    const images = [
        {
            name: 'test',
            url: 'background/test.png',
        },
    ]

    // 载入图片
    images.forEach(item => {
        Game.asset.load({
            type: 'image',
            group: 'bg',
            name: item.name,
            url: item.url
        })
    })

    const roles = [
        {
            group: 'player',
            width: 78,
            interval: 8,
            animations: [
                {
                    url: 'spritesheets/kingHuman-idle.png',
                    name: 'idle'
                },
                {
                    url: 'spritesheets/kingHuman-walk.png',
                    name: 'walk'
                },
                {
                    url: 'spritesheets/kingHuman-attack.png',
                    name: 'attack'
                }
            ]
        },
    ]

    // 载入动画
    roles.forEach(role => {
        role.animations.forEach(animation => {
            Game.asset.load({
                type: 'animation',
                group: role.group,
                name: animation.name,
                url: animation.url,
                width: role.width,
                interval: role.interval,
                flip: role.flip
            })
        })
    })
    // 调试模式
    Game.test = true

    // 创建场景
    Game.execute.switchStage(test())

}