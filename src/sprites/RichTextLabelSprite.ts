import Game from "../game/Game";
import Sprite from "./Sprite";
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

export default class RichTextLabelSprite extends Sprite {
  public container: HTMLDivElement
  public content: string = ""
  protected lastContent: string = ""

  constructor() {
    super()
    this.container = document.createElement("div")
    document.body.appendChild(this.container)
    this.container.style.display = "none";
    this.container.style.userSelect = "none"
    this.container.style.position = 'absolute';
    this.container.style.resize = "none"
  }

  protected _render(delta: number): void {
    this.container.style.display = "block";
    const finalRect = Game.render.getFinalRect(this.transform)
    this.container.style.left = Game.canvasElement.offsetLeft + finalRect.x + "px";
    this.container.style.top = Game.canvasElement.offsetTop + finalRect.y + "px";
    this.container.style.width = finalRect.width + "px"
    this.container.style.height = finalRect.height + "px"
    if (this.lastContent !== this.content) {
      this.lastContent = this.content
      this.container.innerHTML = bbobHTML(`[style color=${Game.render.rgba2hex({ r: 150, g: 200, b: 150, a: 1 })}]bbcode富文本[/style]`, presetHTML5())
    }
  }
}