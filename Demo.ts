import Game, { Sprites, Components, Enums, Plugin } from "./src/index";

(async () => {
  Game.generate("potato")
  Game.resolution = { x: 1920, y: 1080 }

  const amiya = new Plugin.SpineSprite("char_002_amiya")
  amiya.scale = { x: 0.5, y: 0.5 }
  amiya.position.x = 200

  amiya.addAnimation("Idle")
  amiya.addAnimation("Attack", { times: 5, speed: 8, delay: 2 })
  amiya.addAnimation("Idle")


  //Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

