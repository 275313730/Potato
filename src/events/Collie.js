export function collie(player, blocks) {
    for (const key in blocks) {
        const block = blocks[key]
        if (this.geometry.intersect(player, block)) {
            switch (block.type) {
                case 8:
                    player.jumping = false
                    player.y = block.y - player.height
                    break
                case 6:
                    player.walking = false
                    player.x = block.x + block.width
                    break
                case 9:
                    if (player.x - player.speed < block.x + block.width && player.y - player.vSpeed < block.y) {
                        player.jumping = false
                        player.y = block.y - player.height
                    } else {
                        player.walking = false
                        player.x = block.x + block.width
                    }
                    break
                case 3:
                    if (player.x - player.speed < block.x + block.width && player.y - player.vSpeed > block.y) {
                        player.y = block.y + block.height
                    } else {
                        player.walking = false
                        player.x = block.x + block.width
                    }
                    break
                case 2:
                    player.y = block.y + block.height
                    break
            }
            return
        }
    }
}