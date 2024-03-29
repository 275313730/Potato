import ExpandMode from '../enums/ExpandMode';
import Game from '../game';
import TextureRect from '../variant_types/TextureRect';
import Sprite from './Sprite';

export default class TextureSprite extends Sprite {
  public textureRect: TextureRect = {
    texture: new Image(),
    expandMode: ExpandMode.KEEP_SIZE,
    flipH: false,
    flipV: false,
  };

  public get texture() {
    return this.textureRect.texture;
  }

  public get expandMode() {
    return this.textureRect.expandMode;
  }

  public set expandMode(value: number) {
    this.textureRect.expandMode = value;
  }

  public get flipH() {
    return this.textureRect.flipH;
  }

  public set flipH(value: boolean) {
    this.textureRect.flipH = value;
  }

  public get flipV() {
    return this.textureRect.flipV;
  }

  public set flipV(value: boolean) {
    this.textureRect.flipV = value;
  }

  constructor(path?: string) {
    super()
    if (path) this.setTexture(path)
  }

  protected onTextureLoad(): void {
    return;
  }

  public setTexture(path: string): boolean {
    this.texture.src = Game.assetPath + path;
    this.texture.onload = () => {
      if (this.expandMode === ExpandMode.KEEP_SIZE) {
        this.size = { x: this.texture.width, y: this.texture.height };
      }
      this.onTextureLoad();
    };
    return true;
  }

  protected _render(delta: number): void {
    if (!this.texture) return;
    const renderer = this.getRenderer()
    renderer.drawImage(this.transform, this.textureRect);
  }
}
