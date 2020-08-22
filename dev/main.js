import { Game, Stage, Sprite } from "../core/Potato.js";

Game.init({ test: true, width: 1920, height: 1080 });

new Stage({
  created() {
    new Sprite({
      config: {
        id: "test"
      },
      created() {
        this.input.watch("mousedown", mouse => {
          console.log(mouse.x, mouse.y)
        })
      }
    })
  }
})