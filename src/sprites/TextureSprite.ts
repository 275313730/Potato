import Game from "../game/Game";
import Sprite from "./Sprite";
import TextureRect from "../variant_types/TextureRect";
import ExpandMode from "../enums/ExpandMode";

export default class TextureSprite extends Sprite {
  protected _textureRect: TextureRect = {
    texture: new Image(),
    expandMode: ExpandMode.KEEP_SIZE,
    flipH: false,
    flipV: false
  }

  public get textureRect() {
    return this._textureRect
  }

  public setTexture(value: HTMLImageElement): boolean {
    this._textureRect.texture = value
    value.onload = () => {
      if (this._textureRect.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: value.width, y: value.height }
      }
    }
    return true
  }

  public get texture() {
    return this._textureRect.texture
  }

  public set expandMode(value: ExpandMode) {
    this._textureRect.expandMode = value
  }

  public get expandMode() {
    return this._textureRect.expandMode
  }

  public set flipH(value: boolean) {
    this._textureRect.flipH = value
  }

  public get flipH() {
    return this._textureRect.flipH
  }

  public set flipV(value: boolean) {
    this._textureRect.flipV = value
  }

  public get flipV() {
    return this._textureRect.flipV
  }

  _render(): void {
    if (!this.texture) return
    Game.canvas.drawImage(this)
  }
}
