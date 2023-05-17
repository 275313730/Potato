import Game from "../game/Game";
import LabelSprite from "./LabelSprite";

export default class LineEditSprite extends LabelSprite {
  protected isFocus: boolean = false

  public _ready(): void {
    super._ready()
    this.pressed.connect(this.id, () => {
      this.isFocus = true
    })
  }

  protected _render(): void {
    if(this.isFocus){
      
    }
    Game.render.drawRect(this, { r: 50, g: 50, b: 50, a: 1 })
    super._render()
  }
}