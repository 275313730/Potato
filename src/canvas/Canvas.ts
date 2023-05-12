import Update from "../signals/Update"
import UserInput from "../signals/UserInput"
import Sprite from "../sprites/Sprite"
import TextureRect from "../variant_types/TextureRect"
import Vector2 from "../variant_types/Vector2"
import Rect from "../variant_types/Rect"

class Canvas {
  readonly canvasElement: HTMLCanvasElement
  readonly rendering: CanvasRenderingContext2D
  public resolution: Vector2 = { x: 1920, y: 1080 }
  public viewSize: Vector2 = { x: 0, y: 0 }
  public animationInterval: number = 16
  public isTestMode: boolean = false

  public get ratio(): number {
    return this.resolution.x / this.resolution.y
  }

  public get scale(): number {
    return this.viewSize.y / this.resolution.y
  }

  // signals
  public readonly update: Update = new Update()
  public readonly userInput: UserInput = new UserInput()

  constructor(elementId: string = "") {
    if (elementId === "") {
      this.canvasElement = document.createElement("canvas")
    } else {
      this.canvasElement = document.getElementById(elementId) as HTMLCanvasElement
    }
    this.rendering = this.canvasElement.getContext("2d")

    window.onresize = window.onload = () => {
      this.resize()
    }

    this.resize()
  }

  public drawImage(sprite: Sprite, textureRect: TextureRect) {
    let finalX = sprite.position.x * this.scale
    let finalY = sprite.position.y * this.scale
    const finalWidth = sprite.size.x * sprite.scale.x * this.scale
    const finalHeight = sprite.size.y * sprite.scale.y * this.scale
    let scale: Vector2 = { x: 1, y: 1 }
    let trans: Vector2 = { x: 0, y: 0 }
    if (textureRect.flipH) {
      trans.x = finalWidth + finalX * 2
      scale.x = -1
    }
    if (textureRect.flipV) {
      trans.y = finalHeight + finalY * 2
      scale.y = -1
    }
    if (textureRect.flipH || textureRect.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
    this.rendering.drawImage(textureRect.texture, finalX, finalY, finalWidth, finalHeight);
    if (textureRect.flipH || textureRect.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
  }

  public drawClipImage(sprite: Sprite, textureRect: TextureRect, clipRect: Rect) {
    let finalX = sprite.position.x * this.scale
    let finalY = sprite.position.y * this.scale
    const finalWidth = sprite.size.x * sprite.scale.x * this.scale
    const finalHeight = sprite.size.y * sprite.scale.y * this.scale

    let scale: Vector2 = { x: 1, y: 1 }
    let trans: Vector2 = { x: 0, y: 0 }
    if (textureRect.flipH) {
      trans.x = finalWidth + finalX * 2
      scale.x = -1
    }
    if (textureRect.flipV) {
      trans.y = finalHeight + finalY * 2
      scale.y = -1
    }
    if (textureRect.flipH || textureRect.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
    this.rendering.drawImage(textureRect.texture, clipRect.x, clipRect.y, clipRect.width, clipRect.height, finalX, finalY, finalWidth, finalHeight);

    if (textureRect.flipH || textureRect.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
  }

  protected resize() {
    let width = document.body.clientWidth
    let height = document.body.clientHeight
    if (width / height > this.ratio) {
      this.viewSize.x = this.ratio * height;
      this.viewSize.y = height;
    } else {
      this.viewSize.x = width;
      this.viewSize.y = width / this.ratio;
    }
    this.canvasElement.setAttribute("width", this.viewSize.x.toString());
    this.canvasElement.setAttribute("height", this.viewSize.y.toString());
  }

}

export default Canvas