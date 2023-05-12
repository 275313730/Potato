import Game from "../src/game/Game.js"
import Sprite from "../src/sprites/Sprite.js";
import Vector2 from "../src/variant_types/Vector2.js";

export default class Camera {
  /**
   * 初始化相机对象
   */
  protected position: Vector2 = { x: 0, y: 0 }

  protected targetSprite: Sprite | null

  protected movement: any

  /**
   * 创建相机移动函数
   * @param {Vector2} position
   * @param {number} time
   * @param {Vector2} border
   * @param {Function} callback
   * @param {boolean} disable
   */
  createMovement(position: Vector2, time: number, border: Vector2, callback: Function, disable: boolean = false) {
    // 计算数据
    const frames = time * 60 || 1;
    const perX = Math.abs(this.position.x - position.x) / frames;
    const perY = Math.abs(this.position.y - position.y) / frames;

    if (perX === 0 && perY === 0) return;

    // 取消相机跟随
    this.targetSprite = null;

    // 移动计数
    var count = 0;

    // 修改镜头移动函数
    this.movement = () => {
      // 相机移动
      this.position.x += perX;
      this.position.y += perY;

      // 移动计数增加
      count++;

      // 判断移动计数和相机位置
      if (count > frames || (this.position.x < 0 || this.position.x > border.x) || (this.position.y < 0 || this.position.y > border.y)) {
        this.position.x = Math.max(0, this.position.x)
        this.position.x = Math.min(this.position.x, border.x)
        this.position.y = Math.max(0, this.position.y)
        this.position.y = Math.min(this.position.y, border.y)

        // 清空相机移动函数
        this.movement = null;

        // 执行回调函数
        callback && callback();
      }
    }
  }

  /**
   * 计算镜头位置
   */
  cameraCal() {
    // 当相机跟随单位时
    if (this.targetSprite) {
      const position = this.borderCal();
      this.position.x = position.x;
      this.position.y = position.y;
    } else {
      // 执行相机移动函数
      this.movement && this.movement();
    }
  }

  /**
   * 计算边界问题
   * @param {Sprite} sprite 
   */
  borderCal(): Vector2 {
    const { x: ux, y: uy, width: uw, height: uh } = this.followSprite;
    const { width: sw, height: sh } = stage;
    const { width: gw, height: gh } = Game;
    let x, y;

    // 相机处于舞台宽度范围内才会跟随单位x变化，否则固定值
    if (ux < (gw - uw) / 2) {
      x = 0;
    } else if (ux > sw - (gw + uw) / 2) {
      x = sw - gw;
    } else {
      x = ux - (gw - uw) / 2;
    }

    // 相机处于舞台高度范围内才会跟随单位x变化，否则固定值
    if (uy < (gh - uh) / 2) {
      y = 0;
    } else if (uy > sh - (gh + uh) / 2) {
      y = sh - gh;
    } else {
      y = uy - (gh - uh) / 2;
    }

    return { x, y };
  }

  /**
   * 镜头跟随
   * @param {Sprite} sprite 
   */
  followSprite(sprite: Sprite) {
    if (sprite === this.targetSprite) return;
    this.targetSprite = sprite;
  }

  /**
   * 镜头移动
   * @param {number} x 
   * @param {number} y 
   * @param {number} time 
   * @param {Function} callback 
   */
  move(x: number, y: number, time: number, callback: Function) {
    this.createMovement(x, y, time, callback);
  }
  /**
   * 镜头移动到单位
   * @param {Sprite} sprite 
   * @param {number} time 
   * @param {Function} callback 
   */
  moveTo(sprite: Sprite, time: number, callback: Function) {
    // 边界计算
    let { x, y } = this.borderCal();

    this.createMovement({ x: (x - this.position.x), y: (y - this.position.y) }, time, callback);
  }
  /**
   * 解除跟随
   */
  unFollow() {
    this.targetSprite = null;
  }
};
