import { Sprite } from "../../modules/Sprite/Sprite.js"

export function warning() {
    // 添加警告文字
    const text = Sprite.unit.find('text')
    text.txt = `Click to shoot.`
    
    // 相机移动
    this.camera.move(200, 0, 2, () => {
        this.camera.move(-200, 0, 2, () => {
            text.txt = null
            this.camera.follow(Sprite.unit.find('player'))
        })
    })
}