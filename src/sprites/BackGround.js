function backGround(name, src) {
    const options = {
        id: name,
        x: 0,
        y: 0,
        src: src
    }

    return new Sprite(options)
        .loadImage()
}