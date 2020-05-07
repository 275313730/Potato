import { Game } from "../../modules/Game.js"

export function warning() {
    // 添加警告文字
    const text = Game.sprite.find('text')
    text.txt = `Click to shoot.`
    
    // 相机移动
    this.camera.move(200, 0, 2, () => {
        this.camera.move(-200, 0, 2, () => {
            text.txt = null
            this.camera.follow(this.sprite.find('player'))
        })
    })
}