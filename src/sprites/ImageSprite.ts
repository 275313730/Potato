import Game from "../game/Game";
import UserInputEvent from "../variant_types/UserInputEvent";
import Sprite from "./Sprite";

class ImageSprite extends Sprite {
  protected onReady(): void { }
  protected onUpdate(delta: number): void { }
  protected onInput(event: UserInputEvent): void { }
  protected onDestroy(): void { }

  private _image: HTMLImageElement

  public set image(value: HTMLImageElement) {
    this._image = value
    value.onload = () => {
      this.size = { x: value.width, y: value.height }
    }
  }

  public get image() {
    return this._image
  }

  _render(): void {
    if (!this.image) return
    Game.canvas.rendering.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  }
}

export default ImageSprite