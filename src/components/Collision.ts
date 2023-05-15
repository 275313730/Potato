import { AnchorPoint } from "../enums"
import { Rect, Transform, Vector2 } from "../variant_types"
import Component from "./Component"


/**
 * 碰撞体组件
 */
export default class Collision extends Component {
  protected static collisions: Collision[] = []

  public isCollide = false

  public collisions: Collision[] = []

  protected size: Vector2
  protected anchorPoint: AnchorPoint = AnchorPoint.TOP_LEFT

  /**
   * 碰撞体组件构造函数
   * @param size 尺寸
   * @param anchorPoint 
   */
  constructor(size?: Vector2, anchorPoint?: AnchorPoint) {
    super()
    if (size) this.size = size
    if (anchorPoint) this.anchorPoint = anchorPoint
    Collision.collisions.push(this)
  }

  public update() {
    if (this.sprite) {
      this.isCollide = false
      this.collisions = []
      this.checkCollide()
    }
  }

  public unregister() {
    super.unregister()
    for (let i = 0; i < Collision.collisions.length; i++) {
      const collision = Collision.collisions[i];
      if (collision === this) {
        Collision.collisions.splice(i, 1)
        break
      }
    }
  }

  /**
   * 碰撞检测函数
   * @param testPosition 测试碰撞的坐标
   * @returns 返回一个布尔值表示是否碰撞
   */
  public checkCollide(testPosition?: Vector2): boolean {
    let isCollide = false
    let transform: Transform = {
      position: this.sprite.position,
      size: this.sprite.size,
      scale: this.sprite.scale,
      rotation: this.sprite.rotation,
      locateMode: this.sprite.locateMode
    }
    if (testPosition) transform.position = testPosition
    for (let collision of Collision.collisions) {
      if (collision === this) continue
      const { position, size, scale } = collision.sprite

      let rect = getRectByAnchorPoint(transform, this.size || this.sprite.size, this.anchorPoint)
      if (rect.x + rect.width < position.x ||
        rect.x > position.x + size.x * scale.x ||
        rect.y + rect.height < position.y ||
        rect.y > position.y + size.y * scale.y) continue

      if (!testPosition) {
        this.isCollide = true
        this.collisions.push(collision)
      }
      isCollide = true
    }
    return isCollide
  }
}

/**
 * 
 * @param spriteTransform
 * @param size 
 * @param anchorPoint 
 * @returns 
 */
function getRectByAnchorPoint(spriteTransform: Transform, size: Vector2, anchorPoint: AnchorPoint): Rect {
  const { position: pPos, size: pSize, scale: pScale } = spriteTransform
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
