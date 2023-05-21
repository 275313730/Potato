import AnchorPoint from '../enums/AnchorPoint';
import Sprite from '../sprites/Sprite';
import Vector2 from '../variant_types/Vector2';
import Canvas from './Canvas';

export default class Camera {
  public position: Vector2 = { x: 0, y: 0 };

  public anchorPoint: AnchorPoint = AnchorPoint.CENTER;

  protected sacle: number = 1;

  protected targetSprite: Sprite | null = null;

  constructor(canvas: Canvas) {
    canvas.update.connect(-9999, this.update.bind(this, canvas));
  }

  protected update(canvas: Canvas) {
    if (this.targetSprite === null) return;
    let finalX = this.targetSprite.position.x;
    let finalY = this.targetSprite.position.y;
    switch (this.anchorPoint) {
      case AnchorPoint.TOP_CENTER:
        finalX -= canvas.resolution.x / 2;
        break;
      case AnchorPoint.TOP_RIGHT:
        finalX -= canvas.resolution.x;
        break;
      case AnchorPoint.CENTER_LEFT:
        finalY -= canvas.resolution.y / 2;
        break;
      case AnchorPoint.CENTER:
        finalX -= canvas.resolution.x / 2;
        finalY -= canvas.resolution.y / 2;
        break;
      case AnchorPoint.CENTER_RIGHT:
        finalX -= canvas.resolution.x;
        finalY -= canvas.resolution.y / 2;
        break;
      case AnchorPoint.BOTTOM_LEFT:
        finalY -= canvas.resolution.y;
        break;
      case AnchorPoint.BOTTOM_CENTER:
        finalX -= canvas.resolution.x / 2;
        finalY -= canvas.resolution.y;
        break;
      case AnchorPoint.BOTTOM_RIGHT:
        finalX -= canvas.resolution.x;
        finalY -= canvas.resolution.y;
        break;
    }
    this.position = { x: finalX, y: finalY };
  }

  followSprite(sprite: Sprite, anchorPoint: AnchorPoint) {
    this.targetSprite = sprite;
    this.anchorPoint = anchorPoint;
  }
}
