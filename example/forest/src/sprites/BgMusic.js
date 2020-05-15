export function bgMusic() {
    return {
        config: {
            id: 'bgMusic'
        },
        created() {
            this.audio.play({
                type: "music",
                group: "music",
                name: "forest",
                range: 200
            })
        }
    }
}