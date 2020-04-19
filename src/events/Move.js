function move(speed) {
    Stage.distance = Stage.distance || 0
    Stage.distance++
    if (Stage.distance < 0) {
        speed = -speed
    }
    if (Stage.distance > 1500) {
        Stage.distance = -1500
    }
    this.x -= speed
}