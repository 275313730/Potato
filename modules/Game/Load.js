export function load(Game) {
    let loadings = []

    return {
        // 载入图片
        image(id, name, url) {
            if (Game.group.get(id, name)) { return }
            const image = new Image()
            image.src = Game.imagePath + url

            const newPromise = new Promise(resolve => {
                image.onload = () => {
                    Game.group.add(id, name, image)
                    resolve(true)
                }
            })
            loadings.push(newPromise)
        },
        // 载入动画
        animation(id, name, url, width, height, interval, flip) {
            if (Game.group.get(id, name)) { return }
            const image = new Image()
            image.src = Game.imagePath + url

            const newPromise = new Promise(resolve => {
                image.onload = () => {
                    Game.group.add(id, name, { image, width, height, interval, flip })
                    resolve(true)
                }
            })

            loadings.push(newPromise)
        },
        // 载入音频
        audio(id, name, url) {
            if (Game.group.get(id, name)) { return }
            Game.group.add(id, name, new Audio(Game.audioPath + url))
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