export function backGround(id, fixed) {
    return {
        config: {
            id,
            fixed: fixed || 0
        },
        created() {
            this.graphic.image('bg', id)
        }
    }
}