import Game from "../game/Game";
import Sprite from "./Sprite";
import TextureRect from "../variant_types/TextureRect";
import ExpandMode from "../enums/ExpandMode";

export default class TextureSprite extends Sprite {
  protected textureRect: TextureRect = {
    texture: new Image(),
    expandMode: ExpandMode.KEEP_SIZE,
    flipH: false,
    flipV: false
  }

  public setTexture(value: HTMLImageElement): boolean {
    this.textureRect.texture = value
    if (this.textureRect.expandMode === ExpandMode.KEEP_SIZE) {
      value.onload = () => {
        this.size = { x: value.width, y: value.height }
      }
    }
    return true
  }

  public get texture() {
    return this.textureRect.texture
  }

  public set expandMode(value: ExpandMode) {
    this.textureRect.expandMode = value
  }

  public get expandMode() {
    return this.textureRect.expandMode
  }

  public set flipH(value: boolean) {
    this.textureRect.flipH = value
  }

  public get flipH() {
    return this.textureRect.flipH
  }

  public set flipV(value: boolean) {
    this.textureRect.flipV = value
  }

  public get flipV() {
    return this.textureRect.flipV
  }

  _render(): void {
    if (!this.texture) return
    Game.canvas.drawImage(this, this.textureRect)
  }
}
