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
        const bgs = [
            {
                id: 'sky',
                src: 'src/imgs/sky.png'
            },
            {
                id: 'mounFar',
                src: 'src/imgs/moun-far.png'
            },
            {
                id: 'mounNear',
                src: 'src/imgs/moun-near.png'
            },
            {
                id: 'treeFar',
                src: 'src/imgs/tree-far.png'
            },
            {
                id: 'treeNear',
                src: 'src/imgs/tree-near.png'
            }
        ]

        // 初始化后执行的函数
        bgs.forEach(bg => {
            backGround(bg.id, bg.src)
        })

    })



