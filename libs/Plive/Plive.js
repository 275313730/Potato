export function plive() {
    let stageData = {}
    return function () {
        this.plive = {
            save(name, data) {
                stageData[name] = data
            },
            load(name) {
                return stageData[name]
            },
            clear(name) {
                delete stageData[name]
            }
        }
    }
}