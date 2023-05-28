import Game, { Sprites, Components, Enums, Plugin } from "./src/index";

(async () => {
  Game.generate("potato", { x: 1920, y: 1080 })

  const SpineSprite = Plugin.SpineSprite

  //const test = new Sprites.TextureSprite("char_002_amiya_2.png")
  //test.scale = { x: 0.3, y: 0.3 }

  const amiya = new SpineSprite("char_002_amiya")
  amiya.scale = { x: 1, y: 1 }

  amiya.addAnimation("Idle")
  amiya.addAnimation("Attack", { times: 5, speed: 8, delay: 2 })
  amiya.addAnimation("Idle")

  //Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

