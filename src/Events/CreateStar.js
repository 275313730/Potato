function createStar() {
    if (Sprite.has('star') || Stage.player.jumping) { return }
    star()
}