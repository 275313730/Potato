export function sound(group) {
    return {
        play(id, name, volume, alone) {
            if (alone) {
                group.get(id, name).play()
            } else {
                let newSound = group.get(id, name).cloneNode()
                newSound.volume = volume || 1
                newSound.play()
                newSound.addEventListener('ended', () => {
                    newSound = null
                })
            }
        }
    }
}