export function image() {
    let images = {}

    return {
        // 添加
        add(name, img) {
            if (images[name]) { return }
            images[name] = img
        },
        // 获取
        get(name) {
            return images[name]
        }
    }
}