export function group() {
    let groups = {}

    return {
        add(id, name, newAsset) {
            groups[id][name] = newAsset
        },
        get(id, name) {
            if (!groups[id]) { groups[id] = {} }
            return groups[id][name]
        }
    }
}