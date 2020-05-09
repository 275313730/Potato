export function music(asset) {
    let music = null

    return {
        // 播放
        play(group, name) {
            // 切换音乐
            if (music) {
                if (music !== asset.get(group, name)) {
                    music.currentTime = 0
                }
            } else {
                music = asset.get(group, name)
            }
            music.play()
            music.loop = true
        },
        // 暂停
        pause() {
            music.pause()
        },
        // 停止
        stop() {
            music.pause()
            music.currentTime = 0
        },
        // 循环
        loop(boolean) {
            music.loop = boolean
        }
    }
}