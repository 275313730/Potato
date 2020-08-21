import Game from "../Game/Game.js"
import Sprite from "../Sprite/Sprite.js";

export default function camera(stage) {
  /**
   * 初始化相机对象
   */
  var camera = {
    x: 0,
    y: 0,
    follow: null,
    movement: null
  };

  /**
   * 创建相机移动函数
   * @param {number} x 
   * @param {number} y
   * @param {number} time
   * @param {Function} callback 
   * @param {boolean} disable 
   */
  function createMovement(x, y, time, callback, disable = true) {
    // 计算数据
    const frames = time * 60 || 1;
    const perX = x / frames;
    const perY = y / frames;

    if (perX === 0 && perY === 0) return;

    // 取消相机跟随
    camera.follow = null;

    // 获取边界尺寸
    const { width: sw, height: sh } = stage;
    const { width: gw, height: gh } = Game.width;

    // 移动计数
    var count = 0;

    // 禁用单位
    if (disable === true) {
      Game.sprite.travel(function (sprite) {
        sprite.disabled = true;
      })
    }

    // 修改镜头移动函数
    camera.movement = function () {
      // 相机移动
      camera.x += perX;
      camera.y += perY;

      // 移动计数增加
      count++;

      // 判断移动计数和相机位置
      if (count > frames ||
        (camera.x < 0 || camera.x > sw - gw) ||
        (camera.y < 0 || camera.y > sh - gh)) {
        camera.x = Math.max(0, camera.x)
        camera.x = Math.min(camera.x, sw - gw)
        camera.y = Math.max(0, camera.y)
        camera.y = Math.min(camera.y, sh - gh)

        // 清空相机移动函数
        camera.movement = null;

        // 启用单位
        if (disable === true) {
          Game.sprite.travel(function (sprite) {
            sprite.disabled = false;
          });
        }

        // 执行回调函数
        callback && callback();
      }
    }
  }

  /**
   * 计算镜头位置
   */
  function cameraCal() {
    let follow = camera.follow;
    // 当相机跟随单位时
    if (follow) {
      const position = borderCal(follow);
      camera.x = position.x;
      camera.y = position.y;
    } else {
      // 执行相机移动函数
      camera.movement && camera.movement();
    }
  }

  /**
   * 计算边界问题
   * @param {Sprite} sprite 
   */
  function borderCal(sprite) {
    const { x: ux, y: uy, width: uw, height: uh } = sprite;
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

  return {
    /**
     * 镜头跟随
     * @param {Sprite} sprite 
     */
    follow(sprite) {
      if (sprite === camera.follow) return;
      camera.follow = sprite;
    },
    /**
     * 更新镜头数据
     */
    update() {
      // 计算镜头数据
      cameraCal();
      // 返回镜头数据
      return camera;
    },
    /**
     * 镜头移动
     * @param {number} x 
     * @param {number} y 
     * @param {number} time 
     * @param {Function} callback 
     */
    move(x, y, time, callback) {
      createMovement(x, y, time, callback);
    },
    /**
     * 镜头移动到单位
     * @param {Sprite} sprite 
     * @param {number} time 
     * @param {Function} callback 
     */
    moveTo(sprite, time, callback) {
      // 边界计算
      let { x, y } = borderCal(sprite);

      createMovement((x - camera.x), (y - camera.y), time, callback);
    },
    /**
     * 解除跟随
     */
    unFollow() {
      camera.follow = null;
    }
  };
}