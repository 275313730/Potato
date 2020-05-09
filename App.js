// Modules
import { Game } from "./modules/Game/Game.js";

// Title
import { title } from "./src/stages/Title.js";

// 交互使音频可自动播放
window.addEventListener('keydown', App)

export function App(e) {
    // 移除事件
    if (e.key !== ' ') { return }
    tip.parentNode.removeChild(tip)
    window.removeEventListener('keydown', App)

    // 背景图片
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

    // 音频
    const audios = [
        {
            name: 'forest',
            url: 'music/forest.mp3'
        },
        {
            name: 'select',
            url: 'sound/select.mp3'
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
            image: './src/assets/imgs/',
            audio: './src/assets/audio/'
        }
    })

    // 载入图片
    images.forEach(item => {
        Game.asset.load({
            type: 'image',
            group: 'bg',
            name: item.name,
            url: item.url
        })
    })

    // 载入音频
    audios.forEach(audio => {
        Game.asset.load({
            type: 'audio',
            name: audio.name,
            url: audio.url
        })
    })

    // 调试模式
    Game.test = true

    // 创建场景
    Game.execute.switchStage(title())
}