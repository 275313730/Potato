function pox(data) {
    let observer = {}
    return function () {
        const id = this.id
        this.pox = {
            watch(keyString, callback) {
                observer[id] = { keyString, callback }
            },
            unwatch() {
                delete observer[id]
            },
            set(keyString, newVal) {
                const keyArr = keyString.split('.')
                const lastKey = keyArr.pop()
                let currData = data
                keyArr.forEach(key => {
                    currData = currData[key]
                })
                if (currData[lastKey] !== newVal) {
                    currData[lastKey] = newVal
                    this.notify(keyString, newVal)
                }
            },
            notify(keyString, newVal) {
                for (const key in observer) {
                    const unit = observer[key]
                    unit.keyString = keyString
                    unit.callback(newVal)
                }
            }
        }
    }
}
