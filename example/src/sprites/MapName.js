export function mapName(mapId) {
    return {
        config: {
            id: `Forest ${mapId}`,
            y: 15
        },
        created() {
            this.draw.shape(draw)
        }
    }

    // 绘制
    function draw(ctx) {
        ctx.fillStyle = 'red'
        ctx.font = '12px pixel'
        ctx.centerText(this.id, this.game.width / 2, this.y)
    }
}