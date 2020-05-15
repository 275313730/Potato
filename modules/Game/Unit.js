export function unit() {
    let units = {}
    // 图层数组
    let layers = []
    // 排序
    function sort() {
        let newSprites = {}
        // 根据图层值排序
        layers.forEach(layer => {
            for (const key in units) {
                const sprite = units[key]
                if (sprite.layer === layer) {
                    newSprites[sprite.id] = sprite
                    delete units[key]
                }
            }
        })
        units = newSprites
    }

    return {
        // 添加
        add(newUnit) {
            // 检测id是否存在
            if (units[newUnit.id]) {
                throw new Error(`Sprite '${newUnit.id}' exists.`)
            }

            // 加入场景精灵
            units[newUnit.id] = newUnit

            // 如果图层值不在layers中则新增图层值并排序layers
            if (layers.indexOf(newUnit.layer) === -1) {
                layers.push(newUnit.layer)

                // 图层值排序
                layers.sort()
            }

            // 精灵排序
            sort()

            return newUnit
        },
        // 删除
        del(id) {
            const unit = units[id]
            if (!unit) {
                throw new Error(`Unit ${id} doesn't exist`)
            }

            // 单位销毁前
            unit.beforeDestroy && unit.beforeDestroy()

            // 解绑精灵用户事件
            unit.userEvent.delAll()
            delete units[id]

            // 单位销毁后
            unit.destroyed && unit.destroyed()

            return Object.keys(units)
        },
        // 删除所有
        delAll(boolean) {
            if (boolean) {
                for (const key in units) {
                    this.del(key)
                }
            } else {
                let unGlobal = this.filter(unit => {
                    return !unit.global
                })
                for (const key in unGlobal) {
                    this.del(key)
                }
            }
        },
        // 查找
        find(id) {
            return units[id]
        },
        // 过滤
        filter(callback) {
            let newUnits = {}

            for (const key in units) {
                const unit = units[key]
                if (callback(unit) === true) {
                    newUnits[key] = unit
                }
            }

            return newUnits
        },
        // 遍历
        travel(callback) {
            for (const key in units) {
                // 回调函数返回false时停止遍历
                if (callback(units[key]) === false) {
                    break
                }
            }
        },
    }
}