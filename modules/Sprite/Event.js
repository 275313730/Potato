export function event(sprite) {
    let events = {}

    // 初始化方法
    return {
        // 添加
        add(func) {
            // 判断事件是否存在
            if (events[func.name]) { return }
            // 添加事件
            events[func.name] = func
        },
        // 删除
        del(name) {
            // 判断事件是否存在
            if (!events[name]) { return }
            // 删除事件
            delete events[name]
        },
        // 删除所有
        delAll() {
            events = {}
        },
        // 执行
        execute() {
            // disabled时禁用事件
            if (sprite.disabled) { return }
            for (const key in events) {
                events[key].call(sprite)
            }
        }
    }
}
