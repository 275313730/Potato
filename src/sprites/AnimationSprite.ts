import Game from "../game/Game";
import TextureSprite from "./TextureSprite";
import ExpandMode from "../enums/ExpandMode";

export default class AnimationSprite extends TextureSprite {
  protected row: number

  protected column: number

  public currentFrame: number = 0

  protected frames: number

  public interval: number = 8

  protected currentInterval: number = 0

  public get frameWidth() {
    return this.textureRect.texture.width / this.column
  }

  public get frameHeight() {
    return this.textureRect.texture.height / this.row
  }

  public override setTexture(value: HTMLImageElement, row?: number, column?: number): boolean {
    if (!row || !column || row <= 0 || column <= 0) return false
    this.textureRect.texture = value
    this.row = row
    this.column = column
    this.frames = this.row * this.column
    value.onload = () => {
      if (this.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: value.width / column, y: value.height / row }
      }
    }
    return true
  }

  _render(): void {
    if (!this.texture) return
    let startX = this.currentFrame % this.column * this.frameWidth
    let startY = Math.floor(this.currentFrame / this.column) * this.frameHeight
    Game.canvas.drawClipImage(this, { x: startX, y: startY, width: this.frameWidth, height: this.frameHeight })
    this.currentInterval += 1
    if (this.currentInterval < this.interval) return
    this.currentInterval = 0
    this.currentFrame += 1
    if (this.currentFrame >= this.frames) this.currentFrame = 0
  }
}
