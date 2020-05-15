export function event(stage) {
    let events = {}

    return {
        // 添加
        add(fn, ...args) {
            if (events[fn.name]) {
                throw new Error(`Event '${fn.name}' exists.`)
            }
            events[fn.name] = fn.bind(stage, ...args)
        },
        // 删除
        del(name) {
            if (!events[name]) {
                throw new Error(`Event '${name}' doesn't exist.`)
            }
            delete events[name]
        },
        // 单次
        once(fn, ...args) {
            if (events[fn.name]) {
                throw new Error(`Event '${fn.name}' exists.`)
            }
            events[fn.name] = () => {
                fn.call(stage, ...args)
                delete events[fn.name]
            }
        },
        // 遍历
        travel(callback) {
            for (const key in events) {
                callback(events[key])
            }
        }
    }
}