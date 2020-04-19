new Stage
    ({
        el: 'stage',
        width: 272,
        height: 160,
        // 全局事件
        events: {

        }
    })
    .init(function () {
        const bgs = [
            {
                id: 'sky',
                url: 'src/imgs/sky.png',
            },
            {
                id: 'mounFar',
                url: 'src/imgs/moun-far.png',
            },
            {
                id: 'mounNear',
                url: 'src/imgs/moun-near.png',
            },
            {
                id: 'treeFar',
                url: 'src/imgs/tree-far.png',
                sticky: 'mounNear'
            },
            {
                id: 'treeNear',
                url: 'src/imgs/tree-near.png',
                sticky: 'treeFar'
            }
        ]

        // 初始化后执行的函数
        bgs.forEach(bg => {
            if (bg.sticky) {
                stickyBackGround(bg.id, bg.url, bg.sticky)
            } else {
                staticBackGround(bg.id, bg.url)
            }
        })

        camera()
    })



