import { Game } from "../../modules/Game.js"

// loading场景
export function loading(nextStage) {
    if (nextStage === 'forest') {
        const roles = [
            {
                id: 'player',
                width: 40,
                animations: [
                    {
                        url: 'spritesheets/bearded-idle.png',
                        name: 'idle'
                    },
                    {
                        url: 'spritesheets/bearded-walk.png',
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
                Game.animation.role(role.id, role.width, role.interval, true)
            } else {
                Game.animation.role(role.id, role.width)
            }
            role.animations.forEach(animation => {
                Game.load.animation(role.id, animation.name, animation.url)
            })
        })

        // 载入音频
        Game.load.audio('forest', 'music/forest.mp3')
        Game.load.audio('shoot', 'sound/shoot.mp3')
        
        // 切换场景
        Game.stage.switch('forest', 0)
    }
}