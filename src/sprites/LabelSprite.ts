import Color from "../variant_types/Color";
import { FontStyle, FontWeight } from "../enums/Font";
import Sprite from "./Sprite";
import Game from "../Index";

export default class LabelSprite extends Sprite {
  public content: string = ""
  public color: Color = { r: 255, g: 255, b: 255, a: 1 }
  public font: string = "Arial"
  public fontSize: number = 14
  public fontStyle: FontStyle = FontStyle.NORMAL
  public fontWeight: number = FontWeight.NORMAL
  public lineHeight: number = 15

  constructor(maxWidth?: number) {
    super()
    if (maxWidth) this.size.x = maxWidth
  }

  protected _render(): void {
    if (this.content == "") return
    Game.rendering.drawLabel(this)
  }
}