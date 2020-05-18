export function backGround(id, fixed) {
    return {
        config: {
            id,
            fixed: fixed || 0
        },
        created() {
            this.graphics.image('bg', id, true)
        }
    }
}