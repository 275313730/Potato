import { text } from "../sprites/Text.js"

export function warning() {
    // 添加警告文字
    this.sprite.add(text())

    // 相机移动
    this.camera.move(200, 0, 2000, () => {
        this.camera.move(-200, 0, 2000, () => {
            // 删除警告文字
            this.sprite.del('text')
            this.camera.follow(this.sprite.find('player'))
        })
    })
}