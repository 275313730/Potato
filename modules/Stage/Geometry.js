export function geometry() {
    return {
        intersect(spriteA, spriteB) {
            const x1 = spriteA.x
            const y1 = spriteA.y
            const w1 = spriteA.width
            const h1 = spriteA.height

            const x2 = spriteB.x
            const y2 = spriteB.y
            const w2 = spriteB.width
            const h2 = spriteB.height

            if (x1 > x2 + w2 ||
                x1 + w1 < x2 ||
                y1 > y2 + h2 ||
                y1 + h1 < y2) {
                return false
            }
            return true
        },
        // 包含
        contain(spriteA, spriteB) {
            const x1 = spriteA.x
            const y1 = spriteA.y
            const w1 = spriteA.width
            const h1 = spriteA.height

            const x2 = spriteB.x
            const y2 = spriteB.y
            const w2 = spriteB.width
            const h2 = spriteB.height

            if (w1 < w2 && h1 < h2 &&
                (x1 <= x2 || x1 + w1 >= x2 + w2) &&
                (y1 <= y2 || y1 + h1 >= y2 + h2)) {
                return false
            }
            return true
        },
        // 在上面
        above(sprite1, sprite2) {
            if (sprite1.y - sprite1.height <= sprite2 && sprite1.x >= sprite2.x && sprite1.x <= sprite2.x + sprite2.width) {
                return true
            }
            return false
        },
    }
}