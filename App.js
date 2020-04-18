new Stage({
    el: 'stage',
    width: 500,
    height: 300,
    player: player(),
    // 全局事件
    events: {
        createStar
    }
}, () => {
    // 初始化后执行的函数
    star()
})



