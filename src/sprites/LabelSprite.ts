import Color from "../variant_types/Color";
import FontStyle from "../enums/FontStyle";
import Sprite from "./Sprite";
import { LocateMode } from "../enums";
import { Vector2 } from "../variant_types";

export default class LabelSprite extends Sprite {
  public content: string = ""
  public color: Color = { r: 255, g: 255, b: 255, a: 1 }
  public font: string = "Arial"
  public fontSize: number = 14
  public fontStyle: FontStyle = FontStyle.NORMAL

  protected render(): void {
    if (this.content == "") return
    this.canvas.drawLabel(this)
  }
}