import Game from "../game/Game";
import Color from "../variant_types/Color";
import FontStyle from "../enums/FontStyle";
import Sprite from "./Sprite";

export default class LabelSprite extends Sprite {
  public content: string = ""
  public color: Color = { r: 0, g: 0, b: 0, a: 1 }
  public font: string = "Arial"
  public fontSize: number = 14
  public fontStyle: FontStyle = FontStyle.NORMAL

  protected _render(): void {
    if (this.content == "") return
    Game.canvas.drawLabel(this)
  }
}