import Game, { Sprites, Components, Enums } from "./src/Index";

(async () => {
  Game.generate("potato")
  Game.resolution = { x: 1920, y: 1080 }

  const spineSprite = new Sprites.SpineSprite("char_249_mlyss", "Idle", "skel")
  spineSprite.scale = { x: 2, y: 2 }

  //Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

