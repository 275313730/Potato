export function warning(player, text) {
    // 添加警告文字
    text.txt = `Click to shoot.`

    // 相机移动
    this.camera.move(200, 0, 2, () => {
        this.camera.move(-200, 0, 2, () => {
            text.txt = null
            this.camera.follow(player)
        })
    })
}