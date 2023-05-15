import Sprite from "./Sprite";

export default class SubViewSprite extends Sprite {
  protected canvasElement: HTMLCanvasElement = document.createElement("canvas")
  protected rendering: CanvasRenderingContext2D = this.canvasElement.getContext("2d")

  render(): void {
    this.canvas.rendering.drawImage(this.canvasElement, this.position.x, this.position.y)
  }
}
