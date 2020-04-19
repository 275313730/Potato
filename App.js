new Stage
    ({
        el: 'stage',
        width: 272,
        height: 160,
        // 全局事件
        events: {
            move
        }
    })
    .init(function () {
        // 初始化后执行的函数
        sky()
        mounFar()
        MounNear()
        treeFar()
        treeNear()
    })



