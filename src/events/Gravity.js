export function gravity(player, blocks) {
    for (const key in blocks) {
        const block = blocks[key]
        if (this.geometry.tangent(player, block)) {
            return
        }
    }
    player.jumping = true
}