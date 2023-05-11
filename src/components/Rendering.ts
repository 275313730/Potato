import Game from "../game/Game.js"
import Sprite from "../sprites/Sprite.js";
import Vector2 from "../variant_types/Vector2.js";
import Asset from "../systems/AssetSystem.js";
import AssetSystem from "../systems/AssetSystem.js";

class Rendering {
  sprite: Sprite

  /**
   * 绘制执行函数
   */
  executor: Function = null;

  constructor(sprite: Sprite) {
    this.sprite = sprite
  }

  /**
   * 绘制动画
   */
  animation(options: { group: string, name: string, onComplete?: Function }) {
    // 获取动画数据
    let anim = Asset.getAsset(options.group, options.name);
    let sizePerFrame: number = anim.image.width / anim.frame

    let size: Vector2 = { x: sizePerFrame, y: sizePerFrame }

    this.setSize(size);
    // 动画属性
    let animOptions = {
      // 动画帧数
      animationFrames: anim.frame,
      // 动画间隔帧
      animationInterval: anim.interval,
      // 动画尺寸
      size: this.sprite.transform.size,
      // 是否翻转
      flip: anim.flip,
      // 完成时
      onComplete: options.onComplete || null
    };

    // 绘制函数使用的变量
    let currInterval = 0;
    let currFrame = 0;

    // 绘制函数
    this.executor = () => {
      // 绘制动画
      this.drawAnimation(anim.image, currFrame, animOptions.flip);

      // 动画间隔帧增加
      currInterval++;

      // 判断计数是否小于间隔帧数
      if (currInterval >= animOptions.animationInterval) {
        // 动画当前间隔帧归零
        currInterval = 0;

        // 动画关键帧增加
        currFrame++;

        // 判断是否播放完成
        if (currFrame >= animOptions.animationFrames) {
          // 动画重置
          currFrame = 0;

          // 动画完成时执行函数
          animOptions.onComplete && animOptions.onComplete.call(this);
        }
      }
    }

    // 返回数据
    return animOptions;
  }

  /**
   * 清除绘制
   */
  clear() {
    this.executor = null;
  }

  /**
   * 使用原生API绘制
   * @param {Function} drawFn 绘制函数
   */
  draw(drawFn: Function) {
    this.executor = () => {
      drawFn(this.sprite, Game.context);
    }
  }

  /**
   * 绘制图片
   * @param {string} group 资源分组
   * @param {string} name 资源名
   */
  image(group: string, name: string) {
    // 获取图片数据
    let image = Asset.getAsset(group, name);

    this.setSize(image.size);

    // 绘制函数
    this.executor = () => {
      this.drawImage(image);
    }
  }

  /**
   * 混合绘制(混合绘制是在另一个画布上绘制后再复制到原画布上，不会影响原画布)
   * @param {string} type 绘制类型
   * @param {Function} drawCb 绘制函数
   */
  mix(type: string, drawFn: Function) {
    let mixCanvas = Game.canvas.cloneNode() as HTMLCanvasElement;
    let ctx = mixCanvas.getContext('2d');
    let mixImage = new Image();
    if (type === 'static') {
      ctx.clearRect(0, 0, Game.size.x, Game.size.y);
      drawFn(ctx);
      mixImage.src = mixCanvas.toDataURL("image/png");
      this.executor = function () {
        ctx.drawImage(mixImage, 0, 0);
      }
    } else if (type === 'dynamic') {
      this.executor = () => {
        ctx.clearRect(0, 0, Game.size.x, Game.size.y);
        drawFn(ctx);
        mixImage.src = mixCanvas.toDataURL("image/png");
        ctx.drawImage(mixImage, 0, 0);
      }
    }
  }
  /**
   * 绘制粒子
   * @param {string} group 资源分组
   * @param {string} name 资源名
   * @param {number} interval 间隔帧
   * @param {Array<number>} alphaRange 透明度范围
   * @param {Array<number>} scaleRange 缩放度范围
   */
  particle(options: { group: string, name: string, interval: number, alphaRange: Array<number>, scaleRange: Array<number> }) {
    let image = AssetSystem.getAsset(options.group, options.name);

    let spriteTransform = this.sprite.transform
    let spriteAppearance = this.sprite.appearance

    // 设置单位尺寸(粒子单位没有宽度和高度)
    spriteTransform.size = { x: 0, y: 0 };

    // 设置粒子属性
    let nextAlpha: number, nextscale: Vector2;

    let [minAlpha, maxAlpha] = options.alphaRange
    let [minScale, maxScale] = options.scaleRange

    // 检查粒子是否有透明度变化
    if (options.alphaRange) {
      nextAlpha = (maxAlpha - minAlpha) / options.interval;
    }

    // 检查粒子是否有尺寸变化
    if (options.scaleRange) {
      let nextScaleNum = (maxScale - minScale) / options.interval;
      nextscale = { x: nextScaleNum, y: nextScaleNum }
      spriteTransform.scale = nextscale;
    }

    this.executor = () => {
      // 透明度变化
      if (nextAlpha != null) {
        if (spriteAppearance.modulate.a + nextAlpha <= minAlpha || spriteAppearance.modulate.a + nextAlpha >= maxAlpha) {
          nextAlpha = -nextAlpha;
        }
        spriteAppearance.modulate.a += nextAlpha;
      }

      // 尺寸变化
      if (nextscale != null) {
        if (spriteTransform.scale.x + nextscale.x <= minScale || spriteTransform.scale.x + nextscale.x >= maxScale) {
          nextscale.x = - nextscale.x;
          nextscale.y = - nextscale.y;
        }
        spriteTransform.scale.x += nextscale.x;
        spriteTransform.scale.y += nextscale.y;
      }

      this.drawImage(image);
    }
  }

  /**
   * 渲染
   */
  render() {
    var spriteModulate = this.sprite.appearance.modulate

    let { realSize, size, scale, } = this.sprite.transform;
    if (spriteModulate.a <= 0) {
      spriteModulate.a = 0;
      return;
    }
    if (realSize.x + size.x * scale.x < 0 ||
      realSize.x > Game.size.x ||
      realSize.y + size.y * scale.y < 0 ||
      realSize.y > Game.size.y) return;
    this.executor && this.executor();
    Game.isTestMode && this.test();
  }

  setSize(size: Vector2) {
    // 设置单位绘制尺寸
    this.sprite.transform.size = size;
  }

  drawImage(image: ImageBitmap) {
    const { position, scale, flip } = this.sprite.transform;
    if (!flip) {
      let tranlateX = Math.floor(position.x);
      let tranlateY = Math.floor(position.y);
      Game.context.drawImage(image, 0, 0, image.width, image.height, tranlateX, tranlateY, image.width * scale.x, image.height * scale.y);
    } else {
      let tranlateX = Math.floor(Game.size.x - image.width * scale.x - position.x);
      let tranlateY = Math.floor(position.y);

      // 水平翻转绘制
      this.drawFlip(Game.size.x, () => {
        Game.context.drawImage(image, 0, 0, image.width, image.height, tranlateX, tranlateY, image.width * scale.x, image.height * scale.y);
      })
    }
  }

  drawAnimation(image: ImageBitmap, currFrame: number, imageFlip: boolean = false) {
    const { position, scale, flip } = this.sprite.transform;

    // 图片方向
    if (!imageFlip && !flip || imageFlip && flip) {
      let tranlateX = Math.floor(position.x);
      let tranlateY = Math.floor(position.y);
      Game.context.drawImage(image, currFrame * image.width, 0, image.width, image.height, tranlateX, tranlateY, image.width * scale.x, image.height * scale.y);
    } else {
      let tranlateX = Math.floor(Game.size.x - image.width * scale.x - position.x);
      let tranlateY = Math.floor(position.y);

      // 水平翻转绘制
      this.drawFlip(Game.size.x, () => {
        Game.context.drawImage(image, currFrame * image.width, 0, image.width, image.height, tranlateX, tranlateY, image.width * scale.x, image.height * scale.y);
      })
    }
  }

  drawFlip(width: number, drawFn: Function) {
    Game.context.translate(width, 0);
    Game.context.scale(-1, 1);
    drawFn();
    Game.context.translate(width, 0);
    Game.context.scale(-1, 1);
  }

  test() {
    const { realSize, position } = this.sprite.transform;
    Game.context.strokeStyle = 'red';
    Game.context.strokeRect(position.x, position.y, realSize.x, realSize.y);
  }

}
export default Rendering