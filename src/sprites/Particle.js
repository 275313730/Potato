export function particle(id, name, x, y) {
    return {
        config: {
            id,
            x,
            y,
            scale: 0.25,
            fixed: 1,
        },
        created() {
            this.graphics.particle('bg', name, 40, [0, 1])
        }
    }
}