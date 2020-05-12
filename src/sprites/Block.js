export function block(type, x, y, column, row) {
    return {
        config: {
            id: 'block' + Math.random(),
            x,
            y,
            layer: 1,
            width: column * 32,
            height: row * 32
        },
        data: {
            type
        },
        created() {
        }
    }
}