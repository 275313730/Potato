export function pox(data) {
    let observer = {}
    function notify(keyString, newVal) {
        for (const key in observer) {
            const unit = observer[key]
            if (unit.keyString === keyString) {
                unit.callback(newVal)
            }
        }
    }
    return function () {
        const id = this.id
        this.$pox = {
            watch(keyString, callback) {
                observer[id] = { keyString, callback }
            },
            unwatch() {
                delete observer[id]
            },
            set(keyString, callback) {
                const keyArr = keyString.split('.')
                const lastKey = keyArr.pop()
                let currData = data
                keyArr.forEach(key => {
                    currData = currData[key]
                })
                const value = currData[lastKey]
                const newVal = callback(value)
                if (value !== newVal) {
                    currData[lastKey] = newVal
                    notify(keyString, newVal)
                }
            },
            get(keyString) {
                const keyArr = keyString.split('.')
                let currData = data
                keyArr.forEach(key => {
                    currData = currData[key]
                })
                return currData
            },
        }
    }
}