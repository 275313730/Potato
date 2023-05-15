import Sprite from "./Sprite";
import TextureRect from "../variant_types/TextureRect";
import ExpandMode from "../enums/ExpandMode";

export default class TextureSprite extends Sprite implements TextureRect {
  public texture: HTMLImageElement = new Image();
  public expandMode: ExpandMode = ExpandMode.KEEP_SIZE;
  public flipH: boolean = false;
  public flipV: boolean = false;

  public setTexture(value: HTMLImageElement): boolean {
    this.texture = value
    value.onload = () => {
      if (this.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: value.width, y: value.height }
      }
    }
    return true
  }

  render(): void {
    if (!this.texture) return
    this.canvas.drawImage(this)
  }
}
