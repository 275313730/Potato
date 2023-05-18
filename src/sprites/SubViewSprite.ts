import Game from "../game/Game";
import Sprite from "./Sprite";

export default class SubViewSprite extends Sprite {
  public readonly canvasElement: HTMLCanvasElement = document.createElement("canvas")
  protected rendering: CanvasRenderingContext2D = this.canvasElement.getContext("2d")

  protected _render(delta: number): void {
    Game.render.drawSubView(this)
  }
}
