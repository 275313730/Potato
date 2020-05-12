export function geometry() {
    return {
        // 相交
        intersect(spriteA, spriteB) {
            const x1 = spriteA.x
            const y1 = spriteA.y
            const w1 = spriteA.width
            const h1 = spriteA.height

            const x2 = spriteB.x
            const y2 = spriteB.y
            const w2 = spriteB.width
            const h2 = spriteB.height

            if (x1 >= x2 + w2 ||
                x1 + w1 <= x2 ||
                y1 >= y2 + h2 ||
                y1 + h1 <= y2) {
                return false
            }
            return true
        },
        // 相切
        tangent(spriteA, spriteB) {
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
        distance(type, spriteA, spriteB) {
            if (type === 'y') {
                if (spriteB.y > spriteA.y + spriteA.height) {
                    return spriteB.y - (spriteA.y + spriteA.height)
                } else if (spriteA.y > spriteB.y + spriteB.height) {
                    return spriteA.y - (spriteB.y + spriteB.height)
                } else {
                    return 0
                }
            }
            if (type === 'x') {
                if (spriteB.x > spriteA.x + spriteA.width) {
                    return spriteB.x - (spriteA.x + spriteA.width)
                } else if (spriteA.x > spriteB.x + spriteB.width) {
                    return spriteA.x - (spriteB.x + spriteB.width)
                } else {
                    return 0
                }
            }
        },
        // 在上面
        above(spriteA, spriteB) {
            if (spriteA.y + spriteA.height <= spriteB.y && spriteA.x + spriteA.width >= spriteB.x && spriteA.x <= spriteB.x + spriteB.width) {
                return true
            }
            return false
        },
        // 在下面
        under(spriteA, spriteB) {
            if (spriteA.y >= spriteB.y + spriteB.height && spriteA.x + spriteA.width >= spriteB.x && spriteA.x <= spriteB.x + spriteB.width) {
                return true
            }
            return false
        },
        // 在右边
        onRight(spriteA, spriteB) {
            if (spriteA.x >= spriteB.x + spriteB.width && spriteA.y + spriteA.height >= spriteB.y && spriteA.y <= spriteB.y + spriteB.height) {
                return true
            }
            return false
        }
    }
}