export function bgMusic() {
    return {
        config: {
            id: 'bgMusic',
            global: true
        },
        created() {
            this.audio.play({
                type: "music",
                group: "audio",
                name: "forest",
            })
        }
    }
}