import Update from "../signals/Update"
import UserInput from "../signals/UserInput"
import Sprite from "../sprites/Sprite"
import LabelSprite from "../sprites/LabelSprite"
import Vector2 from "../variant_types/Vector2"
import Rect from "../variant_types/Rect"
import Camera from "./Camera"
import LocateMode from "../enums/LocateMode"
import TextureSprite from "../sprites/TextureSprite"
import AnimationSprite from "../sprites/AnimationSprite"
import Color from "../variant_types/Color"

class Canvas {
  readonly canvasElement: HTMLCanvasElement
  readonly rendering: CanvasRenderingContext2D
  readonly camera: Camera
  public resolution: Vector2 = { x: 1920, y: 1080 }
  public viewSize: Vector2 = { x: 0, y: 0 }
  public animationInterval: number = 16
  public isTestMode: boolean = false
  readonly backgroundColor: Color = { r: 15, g: 15, b: 15, a: 1 }

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
    this.camera = new Camera(this)

    window.onresize = window.onload = () => {
      this.resize()
    }

    this.resize()
  }

  protected getFinalRect(sprite: Sprite): Rect {
    switch (sprite.locateMode) {
      case LocateMode.ABSOLUTE:
        return {
          x: sprite.position.x * this.scale,
          y: sprite.position.y * this.scale,
          width: sprite.size.x * sprite.scale.x * this.scale,
          height: sprite.size.y * sprite.scale.y * this.scale
        }
      case LocateMode.REALATIVE:
        return {
          x: (sprite.position.x - this.camera.position.x) * this.scale,
          y: (sprite.position.y - this.camera.position.y) * this.scale,
          width: sprite.size.x * sprite.scale.x * this.scale,
          height: sprite.size.y * sprite.scale.y * this.scale
        }
    }
  }

  public drawTexture(sprite: TextureSprite | AnimationSprite, drawFn: Function) {
    const finalRect = this.getFinalRect(sprite)
    let scale: Vector2 = { x: 1, y: 1 }
    let trans: Vector2 = { x: 0, y: 0 }
    if (sprite.flipH) {
      trans.x = finalRect.width + finalRect.x * 2
      scale.x = -1
    }
    if (sprite.flipV) {
      trans.y = finalRect.height + finalRect.y * 2
      scale.y = -1
    }
    if (sprite.flipH || sprite.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
    drawFn(finalRect)
    if (sprite.flipH || sprite.flipV) {
      this.rendering.translate(trans.x, trans.y)
      this.rendering.scale(scale.x, scale.y)
    }
  }

  public drawLabel(sprite: LabelSprite) {
    const finalRect = this.getFinalRect(sprite)
    this.rendering.font = sprite.fontStyle + " " + sprite.fontSize + "px" + " " + sprite.font
    this.rendering.fillStyle = this.rgba2hex(sprite.color)
    this.rendering.fillText(sprite.content, finalRect.x, finalRect.y)
    this.rendering.fillStyle = this.rgba2hex(this.backgroundColor)
  }

  public drawImage(sprite: TextureSprite) {
    this.drawTexture(sprite, (finalRect: Rect) => {
      this.rendering.drawImage(sprite.texture, finalRect.x, finalRect.y, finalRect.width, finalRect.height)
    })
  }

  public drawClipImage(sprite: AnimationSprite, clipRect: Rect) {
    this.drawTexture(sprite, (finalRect: Rect) => {
      this.rendering.drawImage(sprite.texture, clipRect.x, clipRect.y, clipRect.width, clipRect.height, finalRect.x, finalRect.y, finalRect.width, finalRect.height);
    })
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

  protected rgba2hex(color: Color) {
    let hex = "#" +
      (color.r | 1 << 8).toString(16).slice(1) +
      (color.g | 1 << 8).toString(16).slice(1) +
      (color.b | 1 << 8).toString(16).slice(1);

    let alpha = ((color.a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + alpha;
    return hex;
  }
}

export default Canvas