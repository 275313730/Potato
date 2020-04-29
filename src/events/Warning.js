import { Game } from "../../modules/Game.js"

export function warning() {
    // 添加警告文字
    const text = Game.sprite.find('text')
    text.txt = `Press 'z' to shoot.`
    
    // 相机移动
    this.camera.move(200, 0, 2000, () => {
        this.camera.move(-200, 0, 2000, () => {
            text.txt = null
            this.camera.follow(this.sprite.find('player'))
        })
    })
}