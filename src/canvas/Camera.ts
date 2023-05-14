import Sprite from "../sprites/Sprite";
import Vector2 from "../variant_types/Vector2";
import Canvas from "./Canvas";
import AnchorPoint from "../enums/AnchorPoint";

export default class Camera {
  protected canvas: Canvas

  protected _position: Vector2 = { x: 0, y: 0 }

  public get position() {
    return this._position
  }

  protected _anchorPoint: AnchorPoint = AnchorPoint.CENTER

  public get anchorPoint() {
    return this._anchorPoint
  }

  protected sacle: number = 1

  protected targetSprite: Sprite | null = null

  constructor(canvas: Canvas) {
    this.canvas = canvas
    canvas.update.connect(this.update.bind(this))
  }

  protected update() {
    if (this.targetSprite === null) return
    let finalX = this.targetSprite.position.x
    let finalY = this.targetSprite.position.y
    switch (this._anchorPoint) {
      case AnchorPoint.TOP_CENTER:
        finalX -= (this.canvas.resolution.x / 2)
        break
      case AnchorPoint.TOP_RIGHT:
        finalX -= (this.canvas.resolution.x)
        break
      case AnchorPoint.CENTER_LEFT:
        finalY -= (this.canvas.resolution.y / 2)
        break
      case AnchorPoint.CENTER:
        finalX -= (this.canvas.resolution.x / 2)
        finalY -= (this.canvas.resolution.y / 2)
        break
      case AnchorPoint.CENTER_RIGHT:
        finalX -= this.canvas.resolution.x
        finalY -= this.canvas.resolution.y / 2
        break
      case AnchorPoint.BOTTOM_LEFT:
        finalY -= this.canvas.resolution.y
        break
      case AnchorPoint.BOTTOM_CENTER:
        finalX -= this.canvas.resolution.x / 2
        finalY -= this.canvas.resolution.y
        break
      case AnchorPoint.BOTTOM_RIGHT:
        finalX -= this.canvas.resolution.x
        finalY -= this.canvas.resolution.y
        break
    }
    this._position = { x: finalX, y: finalY }
  }

  followSprite(sprite: Sprite, anchorPoint: AnchorPoint) {
    this.targetSprite = sprite
    this._anchorPoint = anchorPoint
  }

  moveTo(value: Vector2) {

  }
}