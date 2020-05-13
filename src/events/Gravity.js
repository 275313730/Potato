export function gravity(player, blocks) {
    if (player.jumpStatus !== 0) { return }
    for (const key in blocks) {
        const block = blocks[key]
        if (this.geometry.tangent(player, block)) {
            return
        }
    }
    player.fall()
}