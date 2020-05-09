export function sound(asset) {
    return {
        play(group, name, volume, alone) {
            if (alone) {
                asset.get(group, name).play()
            } else {
                let newSound = asset.get(group, name).cloneNode()
                newSound.volume = volume || 1
                newSound.play()
                newSound.addEventListener('ended', () => {
                    newSound = null
                })
            }
        }
    }
}