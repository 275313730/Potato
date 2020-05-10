export function asset(imagePath, audioPath) {
    let loadings = []
    let assets = {}

    return {
        // 载入图片
        load(options) {
            const type = options.type
            const group = options.group 
            const name = options.name
            const url = options.url

            if (!assets[group]) { assets[group] = {} }
            if (assets[group][name]) { return }

            if (type === 'image') {
                const image = new Image()
                image.src = imagePath + url

                const newPromise = new Promise(resolve => {
                    image.onload = () => {
                        assets[group][name] = image
                        resolve(true)
                    }
                })
                loadings.push(newPromise)
                return
            }

            if (type === 'animation') {
                const image = new Image()
                image.src = imagePath + url

                const newPromise = new Promise(resolve => {
                    image.onload = () => {
                        assets[group][name] = {
                            image,
                            width: options.width,
                            height: options.height,
                            interval: options.interval,
                            flip: options.flip
                        }
                        resolve(true)
                    }
                })
                loadings.push(newPromise)
                return
            }

            if (type === 'audio') {
                assets[group][name] = new Audio(audioPath + url)
            }
        },
        allLoaded(callback) {
            if (loadings.length > 0) {
                Promise.all(loadings)
                    .then(() => callback())
            } else {
                callback()
            }
        },
        get(group, name) {
            return assets[group][name]
        }
    }
}