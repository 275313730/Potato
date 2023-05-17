import Sprite from "./Sprite";
import TextureRect from "../variant_types/TextureRect";
import ExpandMode from "../enums/ExpandMode";
import Game from "../Index";

export default class TextureSprite extends Sprite implements TextureRect {
  public texture: HTMLImageElement = new Image();
  public expandMode: ExpandMode = ExpandMode.KEEP_SIZE;
  public flipH: boolean = false;
  public flipV: boolean = false;

  protected onTextureLoad() {

  }

  public setTexture(path: string): boolean {
    this.texture = Game.AssetSystem.loadImage(path)
    this.texture.onload = () => {
      if (this.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: this.texture.width, y: this.texture.height }
      }
      this.onTextureLoad()
    }
    return true
  }

  _render(): void {
    if (!this.texture) return
    Game.rendering.drawImage(this)
  }
}
