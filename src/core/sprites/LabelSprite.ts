import FontStyle from '../enums/FontStyle';
import FontWeight from '../enums/FontWeight';
import Game from '../game';
import Color from '../variant_types/Color';
import Font from '../variant_types/Font';
import Sprite from './Sprite';

export default class LabelSprite extends Sprite {
  public content: string = '';

  public font: Font = {
    fontType: 'Arial',
    fontColor: { r: 255, g: 255, b: 255, a: 1 },
    fontSize: 14,
    fontStyle: FontStyle.NORMAL,
    fontWeight: FontWeight.NORMAL,
    lineHeight: 15,
  };

  public get fontType() {
    return this.font.fontType;
  }

  public set fontType(value: string) {
    this.font.fontType = value;
  }

  public get fontColor() {
    return this.font.fontColor;
  }

  public set fontColor(value: Color) {
    this.font.fontColor = value;
  }

  public get fontSize() {
    return this.font.fontSize;
  }

  public set fontSize(value: number) {
    this.font.fontSize = value;
  }

  public get fontStyle() {
    return this.font.fontStyle;
  }

  public set fontStyle(value: string) {
    this.font.fontStyle = value;
  }

  public get fontWeight() {
    return this.font.fontWeight;
  }

  public set fontWeight(value: number) {
    this.font.fontWeight = value;
  }

  public get lineHeight() {
    return this.font.lineHeight;
  }

  public set lineHeight(value: number) {
    this.font.lineHeight = value;
  }

  protected _render(delta: number): void {
    Game.renderer.drawLabel(this.transform, this.font, this.content);
  }
}
