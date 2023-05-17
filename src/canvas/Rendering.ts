import { FontStyle, LocateMode } from "../enums"
import { AnimationSprite, LabelSprite, Sprite, SubViewSprite, TextureSprite } from "../sprites"
import { Color, Font, Rect, Transform, Vector2 } from "../variant_types"
import Camera from "./Camera"
import Canvas from "./Canvas"

export default class Render {
  public readonly context: CanvasRenderingContext2D
  protected readonly canvas: Canvas
  protected readonly camera: Camera
  public readonly backgroundColor: Color = { r: 15, g: 15, b: 15, a: 1 }

  public get scale() {
    return this.canvas.scale
  }

  constructor(canvas: Canvas) {
    this.context = canvas.canvasElement.getContext("2d") as CanvasRenderingContext2D
    this.canvas = canvas
    this.camera = canvas.camera
  }

  public clear(viewSize: Vector2) {
    this.context.clearRect(0, 0, viewSize.x, viewSize.y)
  }

  protected getFinalRect(sprite: Sprite): Rect {
    switch (sprite.locateMode) {
      case LocateMode.ABSOLUTE:
        return {
          x: sprite.position.x * this.canvas.scale,
          y: sprite.position.y * this.canvas.scale,
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
      default:
        return {
          x: (sprite.position.x - this.camera.position.x) * this.scale,
          y: (sprite.position.y - this.camera.position.y) * this.scale,
          width: sprite.size.x * sprite.scale.x * this.scale,
          height: sprite.size.y * sprite.scale.y * this.scale
        }
    }
  }

  public drawRect(sprite: Sprite, color: Color) {
    const finalRect = this.getFinalRect(sprite)
    this.context.fillStyle = this.rgba2hex(color)
    this.context.fillRect(finalRect.x, finalRect.y, finalRect.width, finalRect.height)
  }

  public drawTexture(sprite: TextureSprite, drawFn: Function) {
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
      this.context.translate(trans.x, trans.y)
      this.context.scale(scale.x, scale.y)
    }
    drawFn(finalRect)
    if (sprite.flipH || sprite.flipV) {
      this.context.translate(trans.x, trans.y)
      this.context.scale(scale.x, scale.y)
    }
  }

  public drawText(transform: Transform, content: string, font: Font) {

  }

  public drawLabel(sprite: LabelSprite) {
    const finalRect = this.getFinalRect(sprite)
    const finalFontSize = sprite.fontSize * sprite.fontSize / 14 * this.scale

    this.context.font = `${sprite.fontStyle} ${sprite.fontWeight} ${finalFontSize}px ${sprite.fontType}`
    this.context.fillStyle = this.rgba2hex(sprite.fontColor)

    if (sprite.size.x > 0) {
      let line = 0
      let lineWidth = 0
      let lineContent = ""
      for (let char of sprite.content) {
        const charWidth = this.context.measureText(char)
        if (lineWidth + charWidth.width <= sprite.size.x) {
          lineWidth += charWidth.width
          lineContent += char
        } else {
          this.context.fillText(lineContent, finalRect.x, finalRect.y + sprite.lineHeight * line)
          line += 1
          lineWidth = charWidth.width
          lineContent = char
        }
      }
      if (lineWidth > 0) {
        this.context.fillText(lineContent, finalRect.x, finalRect.y + sprite.lineHeight * line)
      }
    } else {
      this.context.fillText(sprite.content, finalRect.x, finalRect.y)
    }
  }

  public drawImage(sprite: TextureSprite) {
    this.drawTexture(sprite, (finalRect: Rect) => {
      this.context.drawImage(sprite.texture, finalRect.x, finalRect.y, finalRect.width, finalRect.height)
    })
  }

  public drawClipImage(sprite: TextureSprite, clipRect: Rect) {
    this.drawTexture(sprite, (finalRect: Rect) => {
      this.context.drawImage(sprite.texture, clipRect.x, clipRect.y, clipRect.width, clipRect.height, finalRect.x, finalRect.y, finalRect.width, finalRect.height);
    })
  }

  public drawSubView(sprite: SubViewSprite) {
    const finalRect = this.getFinalRect(sprite)
    this.context.drawImage(sprite.canvasElement, finalRect.x, finalRect.y)
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