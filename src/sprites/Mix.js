export function mix(player) {
    return {
        config: {
            id: 'enviroment',
            layer: 4
        },
        created() {
            this.graphics.mix('dynamic', ctx => {
                ctx.fillStyle = 'black'
                ctx.globalAlpha = 0.8
                ctx.fillRect(player.relX, player.y, player.width, player.height)
            })
        }
    }
}