import { Game } from "../Game/Game.js"

export function audio(unit) {
    let music = { audio: null }
    let sounds = []

    return {
        // 计算音量
        cal() {
            const relX = unit.relX
            const relY = unit.relY
            const distance = Math.sqrt(relX * relX + relY * relY)

            if (music.audio && music.range > 0) {
                const range = music.range
                const audio = music.audio

                if (distance >= range) {
                    audio.volume = 0
                } else {
                    audio.volume = music.defalutVolume * ((range - distance) / range)
                }
            }

            for (let i = 0; i < sounds.length; i++) {
                const sound = sounds[i]
                const range = sound.range
                const audio = sound.audio

                if (audio.ended === true) {
                    sounds.splice(i, 1)
                    i--
                    continue
                }

                if (distance >= range) {
                    audio.volume = 0
                } else {
                    audio.volume = sound.defalutVolume * ((range - distance) / range)
                }
            }
        },
        // 暂停
        pause() {
            music.pause()
        },
        // 播放
        play(options) {
            const type = options.type
            const group = options.group
            const name = options.name
            const range = options.range || 0
            const volume = options.volume || 1
            const loop = options.loop || true
            const newAudio = Game.asset.get(group, name)

            if (type === 'sound') {
                const sound = newAudio.cloneNode()

                sounds.push({
                    audio: sound,
                    defalutVolume: volume,
                    range
                })

                sound.volume = volume
                sound.play()

                return
            }

            if (type === 'music') {
                if (music.audio !== newAudio) {
                    music.audio = newAudio
                    music.defalutVolume = volume
                    music.range = range

                    newAudio.currentTime = 0
                    newAudio.volume = volume
                    newAudio.loop = loop
                }
                newAudio.play()
            }
        },
        // 停止
        stop() {
            music.pause()
            music.currentTime = 0
        },
    }
}