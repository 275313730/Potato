function sky() {
    const options = {
        id: 'sky',
        x: 0,
        y: 0,
        src: 'src/imgs/sky.png'
    }

    return new Sprite(options)
        .loadImage()
}