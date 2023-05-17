import Sprite from "./Sprite";
import Game from "../Index";
import { Font, Color } from "../variant_types";
import { FontStyle, FontWeight } from "../enums";

export default class LabelSprite extends Sprite implements Font {
  public content: string = ""

  public fontType: string = "Arial"
  public fontColor: Color = { r: 255, g: 255, b: 255, a: 1 }
  public fontSize: number = 14
  public fontStyle: string = FontStyle.NORMAL
  public fontWeight: number = FontWeight.NORMAL
  public lineHeight: number = 15

  constructor(maxWidth?: number) {
    super()
    if (maxWidth) this.size.x = maxWidth
  }


  protected _render(): void {
    Game.render.drawLabel(this)
  }
}