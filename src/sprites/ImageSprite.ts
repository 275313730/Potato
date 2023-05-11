import Game from "../game/Game";
import Sprite from "./Sprite";

class ImageSprite extends Sprite {
  image: HTMLImageElement

  _render(): void {
    if (!this.image) return
    const { position, scale } = this.transform;
    Game.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, position.x, position.y, this.image.width * scale.x * Game.scale, this.image.height * scale.y * Game.scale);
  }
}

export default ImageSprite