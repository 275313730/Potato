function staticBackGround(name, url) {
    const options = {
        id: name,
        x: 0,
        y: 0,
        url: url
    }

    return new Sprite(options)
        .loadImage()
}

function stickyBackGround(id, url, sticky) {
    const options = {
        id,
        x: 0,
        y: 0,
        url,
        sticky
    }

    return new Sprite(options)
        .stick(sticky)
        .loadImage()
}