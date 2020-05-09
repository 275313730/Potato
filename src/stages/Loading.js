import { Game } from "../../modules/Game/Game.js"
import { text } from "../sprites/Text.js"
import { Sprite } from "../../modules/Sprite/Sprite.js"
import { forest } from "./Forest.js"

// loading场景
export function loading(nextStage) {
    return {
        created() {
            if (nextStage === 'forest') {
                const roles = [
                    {
                        id: 'player',
                        width: 78,
                        interval: 8,
                        animations: [
                            {
                                url: 'spritesheets/kingHuman-idle.png',
                                name: 'idle'
                            },
                            {
                                url: 'spritesheets/kingHuman-walk.png',
                                name: 'walk'
                            }
                        ]
                    },
                    {
                        id: 'woman',
                        width: 37,
                        animations: [
                            {
                                url: 'spritesheets/woman-idle.png',
                                name: 'idle'
                            },
                            {
                                url: 'spritesheets/woman-walk.png',
                                name: 'walk'
                            }
                        ]
                    },
                    {
                        id: 'oldman',
                        width: 34,
                        animations: [
                            {
                                url: 'spritesheets/oldman-idle.png',
                                name: 'idle'
                            },
                            {
                                url: 'spritesheets/oldman-walk.png',
                                name: 'walk'
                            }
                        ]
                    },
                    {
                        id: 'hatman',
                        width: 39,
                        animations: [
                            {
                                url: 'spritesheets/hat-man-idle.png',
                                name: 'idle'
                            },
                            {
                                url: 'spritesheets/hat-man-walk.png',
                                name: 'walk'
                            }
                        ]
                    },
                    {
                        id: 'hyena',
                        width: 48,
                        interval: 10,
                        animations: [
                            {
                                url: 'spritesheets/hyena-idle.png',
                                name: 'idle'
                            },
                            {
                                url: 'spritesheets/hyena-walk.png',
                                name: 'walk'
                            },
                            {
                                url: 'spritesheets/hyena-death.png',
                                name: 'death'
                            },
                            {
                                url: 'spritesheets/hyena-attack.png',
                                name: 'attack'
                            }
                        ]
                    }
                ]

                // 载入动画
                roles.forEach(role => {
                    if (role.id === 'hyena') {
                        Game.animation.addRole(role.id, role.width, role.interval, true)
                    } else {
                        Game.animation.addRole(role.id, role.width, role.interval)
                    }
                    role.animations.forEach(animation => {
                        Game.load.animation(role.id, animation.name, animation.url)
                    })
                })

                // 载入粒子图片
                Game.load.image('twinkling', 'particle/twinkling.png')

                // 载入音频
                Game.load.audio('forest', 'music/forest.mp3')
                Game.load.audio('shoot', 'sound/shoot.mp3')

                // 载入提示文本
                new Sprite(text())

                // 切换场景
                Game.execute.switchStage(forest(0))
            }
        }
    }
}