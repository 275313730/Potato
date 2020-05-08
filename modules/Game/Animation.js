export function animation(animationInterval) {
    let animations = {}

    return {
        // 添加角色
        addRole(id, width, interval, flip) {
            if (animations[id]) { return }
            animations[id] = {}
            animations[id].width = width
            animations[id].interval = interval || animationInterval
            animations[id].flip = flip || false
        },
        // 添加
        addAnimation(id, name, image) {
            if (animations[id][name]) { return }
            animations[id][name] = image
        },
        // 获取动画
        get(id, name) {
            if (animations[id][name]) {
                return {
                    image: animations[id][name],
                    width: animations[id].width,
                    flip: animations[id].flip,
                    interval: animations[id].interval
                }
            }
        }
    }
}