export function stage(Game, stages) {
    let currStage = null
    function swtichStage(newStage, ...args) {
        // 销毁场景
        currStage && currStage.execute.destory()

        // 清空按键
        Game.key = null

        // 创建场景
        currStage = stages[newStage](...args)
    }

    return {
        // 切换
        switch(newStage, ...args) {
            Game.load.allLoaded(() => swtichStage(newStage, ...args))
        }
    }
}