function static() {
    const options = {
        id: 'static',
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
        },
        {
            id: 'treeNear',
            url: 'src/imgs/tree-near.png'
        }
    ]

    return new Stage(options)
        .set(function () {
            // 初始化后执行的函数
            bgs.forEach(bg => {
                this.createUnit(staticBackGround(bg.id, bg.url))
            })

            this.createUnit(camera('treeNear'))
        })
        .create()
}




