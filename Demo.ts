import Game, { Sprites, Components, Enums, Plugin } from "./src/index";

(async () => {
  Game.generate("potato")
  Game.resolution = { x: 1920, y: 1080 }

  const idleAmiya = new Plugin.SpineSprite("char_002_amiya")
  idleAmiya.scale = { x: 0.5, y: 0.5 }
  idleAmiya.addAnimation({ animationName: "Idle", speed: 1, times: -1 })

  const attckAmiya = new Plugin.SpineSprite("char_002_amiya")
  attckAmiya.scale = { x: 0.5, y: 0.5 }
  attckAmiya.position.x = 200

  attckAmiya.addAnimation({ animationName: "Attack", speed: 8, times: 8 })
  attckAmiya.addAnimation({ animationName: "Idle", speed: 1, times: -1 })


  //Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

