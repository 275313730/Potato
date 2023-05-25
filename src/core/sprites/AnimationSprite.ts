import Game from '../game';
import ExpandMode from '../enums/ExpandMode';
import TextureSprite from './TextureSprite';

export default class AnimationSprite extends TextureSprite {
  protected row: number = 0;

  protected column: number = 0;

  public currentFrame: number = 0;

  protected frames: number = 0;

  public interval: number = 8;

  protected currentInterval: number = 0;

  public get frameWidth() {
    return this.texture.width / this.column;
  }

  public get frameHeight() {
    return this.texture.height / this.row;
  }

  public override setTexture(path: string, row?: number, column?: number): boolean {
    if (!row || !column || row <= 0 || column <= 0) return false;
    this.texture.src = Game.assetPath + path;
    this.row = row;
    this.column = column;
    this.frames = this.row * this.column;
    this.texture.onload = () => {
      if (this.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: this.texture.width / column, y: this.texture.height / row };
      }
    };
    return true;
  }

  protected _render(delta: number): void {
    if (!this.texture) return;
    const startX = (this.currentFrame % this.column) * this.frameWidth;
    const startY = Math.floor(this.currentFrame / this.column) * this.frameHeight;
    Game.render.drawClipImage(this.transform, this.textureRect, {
      x: startX,
      y: startY,
      width: this.frameWidth,
      height: this.frameHeight,
    });
    this.currentInterval += 1;
    if (this.currentInterval < this.interval) return;
    this.currentInterval = 0;
    this.currentFrame += 1;
    if (this.currentFrame >= this.frames) this.currentFrame = 0;
  }
}
