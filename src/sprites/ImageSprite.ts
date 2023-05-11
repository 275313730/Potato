import Game from "../game/Game";
import Sprite from "./Sprite";

class ImageSprite extends Sprite {
  image: ImageBitmap

  _render(): void {
    if (!this.image) return
    const { position, scale } = this.transform;
    let tranlateX = Math.floor(position.x);
    let tranlateY = Math.floor(position.y);
    Game.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, tranlateX, tranlateY, this.image.width * scale.x, this.image.height * scale.y);
  }
}

export default ImageSprite