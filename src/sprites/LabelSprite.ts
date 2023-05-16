import Color from "../variant_types/Color";
import FontStyle from "../enums/FontStyle";
import Sprite from "./Sprite";
import Game from "../Index";

export default class LabelSprite extends Sprite {
  public content: string = ""
  public color: Color = { r: 255, g: 255, b: 255, a: 1 }
  public font: string = "Arial"
  public fontSize: number = 14
  public fontStyle: FontStyle = FontStyle.NORMAL

  protected _render(): void {
    if (this.content == "") return
    Game.canvas.drawLabel(this)
  }
}