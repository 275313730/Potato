import Game from "../game/Game";
import Sprite from "./Sprite";

class SubViewSprite extends Sprite {
  protected canvasElement: HTMLCanvasElement = document.createElement("canvas")
  protected rendering: CanvasRenderingContext2D = this.canvasElement.getContext("2d")

  _render(): void {
    Game.canvas.rendering.drawImage(this.canvasElement, this.position.x, this.position.y)
  }
}

export default SubViewSprite