function camera(sticky) {
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
                    console.log(0)
                    this.sticky.stickyMove && this.sticky.stickyMove(1.5)
                }
                break
            case 'ArrowLeft':
                if (this.sticky.x < 0) {
                    this.sticky.x += 2
                    this.sticky.stickyMove && this.sticky.stickyMove(-1.5)
                }
                break
            case ' ':
                Game.jump('static')
                break
        }
    }

    return new Sprite(options)
        .stick(sticky)
        .bindKey(keyDown, 'keydown')
}