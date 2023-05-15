import { AnchorPoint } from "../enums"
import { Rect, Transform, Vector2 } from "../variant_types"
import Component from "./Component"

export default class Collision extends Component {
  protected static collisions: Collision[] = []

  public isCollide = false

  public collisions: Collision[] = []

  protected _size: Vector2
  protected _anchorPoint: AnchorPoint = AnchorPoint.TOP_LEFT

  public get anchorPoint() {
    return this._anchorPoint
  }

  public get size() {
    if (this._size) return this._size
    return this.sprite.size
  }

  public get position() {
    return this.sprite.position
  }

  public get scale() {
    return this.sprite.scale
  }

  constructor(size?: Vector2, anchorPoint?: AnchorPoint) {
    super()
    if (size) this._size = size
    if (anchorPoint) this._anchorPoint = anchorPoint
    Collision.collisions.push(this)
  }

  public update() {
    if (this.sprite === null) return
    this.isCollide = false
    this.collisions = []
    this.checkCollide()
  }

  public unregister(): void {
    super.unregister()
    for (let i = 0; i < Collision.collisions.length; i++) {
      const collision = Collision.collisions[i];
      if (collision === this) {
        Collision.collisions.splice(i, 1)
        return
      }
    }
  }

  /**
   * 
   * @param testPosition 测试碰撞的坐标
   * @returns 返回一个布尔值表示是否碰撞
   */
  public checkCollide(testPosition?: Vector2): boolean {
    let isCollide = false
    let transform = new Transform()
    transform.position = this.sprite.position
    transform.size = this.sprite.size
    transform.scale = this.sprite.scale
    if (testPosition) transform.position = testPosition
    for (let collision of Collision.collisions) {
      if (collision === this) continue
      let rect = getRectByAnchorPoint(transform, this.size, this._anchorPoint)
      if (rect.x + rect.width < collision.position.x ||
        rect.x > collision.position.x + collision.size.x * collision.scale.x ||
        rect.y + rect.height < collision.position.y ||
        rect.y > collision.position.y + collision.size.y * collision.scale.y) continue

      if (!testPosition) {
        this.isCollide = true
        this.collisions.push(collision)
      }
      isCollide = true
    }
    return isCollide
  }
}

function getRectByAnchorPoint(parentTransform: Transform, size: Vector2, anchorPoint: AnchorPoint): Rect {
  const { position: pPos, size: pSize, scale: pScale } = parentTransform
  let rect: Rect = { x: pPos.x, y: pPos.y, width: size.x * pScale.x, height: size.y * pScale.y }
  const pCenterPos: Vector2 = { x: pPos.x + pSize.x * pScale.x / 2, y: pPos.y + pSize.y * pScale.y / 2 }
  switch (anchorPoint) {
    case AnchorPoint.TOP_CENTER:
      rect.x = pCenterPos.x - rect.width / 2
      break
    case AnchorPoint.TOP_RIGHT:
      rect.x = pCenterPos.x - rect.width
      break
    case AnchorPoint.CENTER_LEFT:
      rect.y = pCenterPos.y - rect.height / 2
      break
    case AnchorPoint.CENTER:
      rect.x = pCenterPos.x - rect.width / 2
      rect.y = pCenterPos.y - rect.height / 2
      break
    case AnchorPoint.CENTER_RIGHT:
      rect.x = pCenterPos.x - rect.width
      rect.y = pCenterPos.y - rect.height / 2
      break
    case AnchorPoint.BOTTOM_LEFT:
      rect.y = pCenterPos.y - rect.height
      break
    case AnchorPoint.BOTTOM_CENTER:
      rect.x = pCenterPos.x - rect.width / 2
      rect.y = pCenterPos.y - rect.height
      break
    case AnchorPoint.BOTTOM_RIGHT:
      rect.x = pCenterPos.x - rect.width
      rect.y = pCenterPos.y - rect.height
      break
  }
  return rect
}