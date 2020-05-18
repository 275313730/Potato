export function plive() {
    let stageData = {}
    let lastStage = null
    return function () {
        this.plive = {
            save(name, data) {
                stageData[name] = JSON.parse(JSON.stringify(data))
                lastStage = name
            },
            load(name) {
                return stageData[name]
            },
            loadLast() {
                return stageData[lastStage]
            },
            clear(name) {
                delete stageData[name]
            },
            clearAll() {
                stageData = {}
            }
        }
    }
}