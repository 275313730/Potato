export function load(Game) {
    let loadings = []

    return {
        // 载入图片
        image(name, url) {
            if (Game.image.get(name)) { return }
            const image = new Image()
            image.src = Game.imagePath + url

            const newPromise = new Promise(resolve => {
                image.onload = () => {
                    Game.image.add(name, image)
                    resolve(true)
                }
            })
            loadings.push(newPromise)
        },
        // 载入动画
        animation(id, name, url) {
            if (Game.animation.get(id, name)) { return }
            const image = new Image()
            image.src = Game.imagePath + url

            const newPromise = new Promise(resolve => {
                image.onload = () => {
                    Game.animation.addAnimation(id, name, image)
                    resolve(true)
                }
            })

            loadings.push(newPromise)
        },
        // 载入音频
        audio(name, url) {
            if (Game.audio.get(name)) { return }
            Game.audio.add(name, new Audio(Game.audioPath + url))
        },
        allLoaded(callback) {
            if (loadings.length > 0) {
                Promise.all(loadings)
                    .then(() => callback())
            } else {
                callback()
            }
        }
    }
}