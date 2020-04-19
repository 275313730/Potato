function start() {
    const options = {
        id: 'start',
        // 全局事件
        events: {

        }
    }

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

    return new Stage(options)
        .set(function () {
            // 初始化后执行的函数
            bgs.forEach(bg => {
                if (bg.sticky) {
                    this.createUnit(stickyBackGround(bg.id, bg.url, bg.sticky))
                } else {
                    this.createUnit(staticBackGround(bg.id, bg.url))
                }
            })

            this.createUnit(camera('treeNear'))

        })
        .create()
}




