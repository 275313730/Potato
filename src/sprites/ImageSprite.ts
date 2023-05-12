import Game from "../game/Game";
import Sprite from "./Sprite";

class ImageSprite extends Sprite {
  public keepImageSize: boolean = true

  private _image: HTMLImageElement

  public set image(value: HTMLImageElement) {
    this._image = value
    if (this.keepImageSize) {
      value.onload = () => {
        this.size = { x: value.width, y: value.height }
      }
    }
  }

  public get image() {
    return this._image
  }

  _render(): void {
    if (!this.image) return
    Game.canvas.rendering.drawImage(this.image, 0, 0, this.size.x, this.size.y);
  }
}

export default ImageSprite