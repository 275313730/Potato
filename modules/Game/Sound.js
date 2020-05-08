export function sound(audio) {
    return {
        play(name, volume, alone) {
            if (alone) {
                audio.get(name).play()
            } else {
                let newSound = audio.get(name).cloneNode()
                newSound.volume = volume || 1
                newSound.play()
                newSound.addEventListener('ended', () => {
                    newSound = null
                })
            }
        }
    }
}