function staticBackGround(id, url) {
    const options = {
        id,
        x: 0,
        y: 0,
    }

    return new Sprite(options)
        .loadImage(url)
}

function stickyBackGround(id, url, sticky) {
    const options = {
        id,
        x: 0,
        y: 0,
        stickyMove: function (speed) {
            if (this.sticky) {
                this.sticky.x -= speed
                if (speed < 0) {
                    speed += 0.5
                } else {
                    speed -= 0.5
                }
                this.sticky.stickyMove && this.sticky.stickyMove(speed)
            }
        }
    }

    return new Sprite(options)
        .stick(sticky)
        .loadImage(url)
}