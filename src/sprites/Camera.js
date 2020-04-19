function camera() {
    const options = {
        id: 'camera',
        x: 0,
        y: 0
    }

    function keyDown(key) {
        switch (key) {
            case 'ArrowRight':
                if (this.sticky.x > -270) {
                    this.sticky.x -= 2
                    this.sticky.sticky.x -= 1.5
                    this.sticky.sticky.sticky.x -= 1
                }
                break
            case 'ArrowLeft':
                if (this.sticky.x < 0) {
                    this.sticky.x += 2
                    this.sticky.sticky.x += 1.5
                    this.sticky.sticky.sticky.x += 1
                }
                break
        }
    }

    return new Sprite(options)
        .stick('treeNear')
        .bindKey(keyDown, 'keydown')
}