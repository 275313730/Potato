// modules
import { Game } from "./modules/Game.js";

// stages
import { test } from "./src/stages/Test.js";

// 交互
window.addEventListener('keydown', App)

export function App(e) {
    // 移除事件
    if (e.key !== ' ') { return }
    window.removeEventListener('keydown', App)

    // 初始化Game类
    Game.init({
        el: 'app',
        // 设置宽高
        width: 640,
        height: 480,
        // 设置文件路径
        path: {
            image: 'src/assets/image/',
            audio: 'src/assets/audio/'
        },
        // 载入场景
        stages: {
            test
        }
    })

    const kingHuman = [
        {
            url: '01-King Human/Idle (78x58).png',
            name: 'idle'
        },
        {
            url: '01-King Human/Run (78x58).png',
            name: 'walk'
        }
    ]

    Game.animation.addRole('kingHuman', 78, 8)
    kingHuman.forEach(animation => {
        Game.load.animation('kingHuman', animation.name, animation.url)
    })

    // 调试模式
    Game.test = true

    // 创建场景
    Game.stage.switch('test')
}