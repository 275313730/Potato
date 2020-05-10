export function audio(asset) {
    let music = null

    return {
        // 播放
        play(type, group, name, volume = 1, loop = true) {
            if (type === 'sound') {
                const sound = asset.get(group, name).cloneNode()
                sound.volume = volume
                sound.play()
                sound.addEventListener('ended', () => {
                    sound.remove()
                })
                return
            }

            if (type === 'music') {
                if (music !== asset.get(group, name)) {
                    music = asset.get(group, name)
                    music.currentTime = 0
                    music.volume = volume
                    music.loop = loop
                }
                music.play()
            }
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
    }
}