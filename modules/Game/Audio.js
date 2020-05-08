export function audio() {
    let audios = {}

    return {
        // 添加
        add(name, audio) {
            if (audios[name]) { return }
            audios[name] = audio
        },
        // 获取
        get(name) {
            return audios[name]
        }
    }
}