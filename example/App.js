// modules
import { Game } from "../modules/Game.js";

// stages
import { title } from "./src/stages/Title.js";
import { forest } from "./src/stages/Forest.js";
import { loading } from "./src/stages/Loading.js";

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

    // 音频
    const audios = [
        {
            id: 'forest',
            url: 'music/forest.mp3'
        },
        {
            id: 'select',
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
            image: 'src/assets/imgs/',
            audio: 'src/assets/audio/'
        },
        // 载入场景
        stages: {
            title,
            loading,
            forest
        }
    })

    // 载入图片
    images.forEach(item => {
        Game.load.image(item.id, item.url)
    })

    // 载入音频
    audios.forEach(audio => {
        Game.load.audio(audio.id, audio.url)
    })

    // 调试模式
    Game.test = true

    // 创建场景
    Game.stage.switch('title')
}