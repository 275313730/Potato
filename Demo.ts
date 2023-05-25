import Game, { Sprites, Components, Enums, Plugin } from "./src/index";

(async () => {
  Game.generate("potato")
  Game.resolution = { x: 1920, y: 1080 }

  const idleAmiya = new Plugin.SpineSprite("char_002_amiya", "Idle")
  idleAmiya.scale = { x: 0.5, y: 0.5 }

  const attckAmiya = new Plugin.SpineSprite("char_002_amiya", "Attack", 8)
  attckAmiya.scale = { x: 0.5, y: 0.5 }
  attckAmiya.position.x = 200


  //Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

