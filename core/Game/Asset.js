export function asset(Game) {
    const imagePath = Game.imagePath
    const audioPath = Game.audioPath
    let loadings = []
    let assets = {}

    return {
        // new Stage()时会自动调用该函数
        allLoaded(callback) {
            if (loadings.length > 0) {
                Promise.all(loadings)
                    .then(() => callback())
            } else {
                callback()
            }
        },
        // 获取资源
        get(group, name) {
            return assets[group][name]
        },
        // 载入资源
        load(options) {
            const type = options.type
            const group = options.group
            const name = options.name
            const url = options.url

            if (!assets[group]) { assets[group] = {} }
            if (assets[group][name]) { return }

            if (type === 'image') {
                const image = new Image()
                loadings.push(new Promise(resolve => {
                    image.onload = () => {
                        assets[group][name] = image
                        resolve(true)
                    }
                }))
                image.src = imagePath + url
                return
            }

            if (type === 'animation') {
                const image = new Image()
                loadings.push(new Promise(resolve => {
                    image.onload = () => {
                        assets[group][name] = {
                            image,
                            width: options.width,
                            interval: options.interval,
                            flip: options.flip
                        }
                        resolve(true)
                    }
                }))
                image.src = imagePath + url
                return
            }

            if (type === 'audio') {
                assets[group][name] = new Audio(audioPath + url)
            }
        },
    }
}