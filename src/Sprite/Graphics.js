import Game from "../Game/index.js"

export default function graphics(sprite) {
  const ctx = Game.canvas.getContext('2d');
  const floor = Math.floor;

  /**
   * 绘制执行函数
   */
  let executor = null;

  /**
   * 设置尺寸
   * @param {number} width 宽度
   * @param {number} height 高度
   * @param {boolean} sameSize 是否与图片相同尺寸
   */
  function setSize(width, height, sameSize) {
    // 设置单位绘制尺寸
    sprite.drawWidth = width;
    sprite.drawHeight = height;

    if (sameSize) {
      sprite.width = width;
      sprite.height = height;
    }
  }

  /**
   * 获取精灵数据
   */
  function getData() {
    return {
      relX: sprite.relX,
      relY: sprite.relY,
      offsetLeft: sprite.offsetLeft,
      offsetTop: sprite.offsetTop,
      width: sprite.width,
      height: sprite.height,
      drawWidth: sprite.drawWidth,
      drawHeight: sprite.drawHeight,
      scale: sprite.scale,
      flip: sprite.flip
    };
  }

  /**
   * 绘制图片
   * @param {Image} image 图片
   */
  function drawImage(image) {
    var { relX, relY, offsetLeft, offsetTop, width, drawWidth, drawHeight, scale, flip } = getData();
    if (!flip) {
      var tranlateX = floor(relX + offsetLeft);
      var tranlateY = floor(relY + offsetTop);
      ctx.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale);
    } else {
      var tranlateX = floor(Game.width - width * scale - relX + offsetLeft);
      var tranlateY = floor(relY + offsetTop);

      // 水平翻转绘制
      drawFlip(Game.width, function () {
        ctx.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale);
      })
    }
  }

  /**
   * 绘制动画
   * @param {Image} image 图片
   * @param {number} currFrame 当前帧
   * @param {boolean} imageFlip 是否翻转
   */
  function drawAnimation(image, currFrame, imageFlip) {
    var { relX, relY, offsetLeft, offsetTop, width, drawWidth, drawHeight, scale, flip } = getData();

    // 图片方向
    if (!imageFlip && !flip || imageFlip && flip) {
      var tranlateX = floor(relX + offsetLeft);
      var tranlateY = floor(relY + offsetTop);
      ctx.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale);
    } else {
      var tranlateX = floor(Game.width - width * scale - relX + offsetLeft);
      var tranlateY = floor(relY + offsetTop);

      // 水平翻转绘制
      drawFlip(Game.width, function () {
        ctx.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale);
      })
    }
  }

  /**
   * 翻转绘制
   * @param {number} width 宽度
   * @param {Function} drawCb 绘制函数
   */
  function drawFlip(width, drawCb) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    drawCb();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  /**
   * 测试开启时调用
   */
  function test() {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(sprite.relX, sprite.relY, sprite.width, sprite.height);
  }

  return {
    /**
     * 绘制动画
     * @param {string} group 资源分组
     * @param {string} name 资源名
     * @param {boolean} sameSize 是否与图片相同尺寸
     */
    animation(group, name, sameSize = false) {
      // 获取动画数据
      let anim = Game.asset.get(group, name);

      setSize(anim.image.width / anim.frame, anim.image.height, sameSize);
      // 动画属性
      let options = {
        // 动画帧数
        animationFrames: anim.frame,
        // 动画间隔帧
        animationInterval: anim.interval || Game.animationInterval,
        // 动画帧宽度
        width: sprite.drawWidth,
        // 动画帧高度
        height: sprite.drawHeight,
        // 是否翻转
        flip: anim.flip,
        // 完成时
        onComplete: null,
      };

      // 绘制函数使用的变量
      let currInterval = 0;
      let currFrame = 0;

      // 绘制函数
      executor = function () {
        // 绘制动画
        drawAnimation(anim.image, currFrame, options.flip);

        // 动画间隔帧增加
        currInterval++;

        // 判断计数是否小于间隔帧数
        if (currInterval >= options.animationInterval) {
          // 动画当前间隔帧归零
          currInterval = 0;

          // 动画关键帧增加
          currFrame++;

          // 判断是否播放完成
          if (currFrame >= options.animationFrames) {
            // 动画重置
            currFrame = 0;

            // 动画完成时执行函数
            options.onComplete && options.onComplete.call(this);
          }
        }
      }

      // 返回数据
      return options;
    },
    /**
     * 清除绘制
     */
    clear() {
      executor = null;
    },
    /**
     * 使用原生API绘制
     * @param {Function} drawCb 绘制函数
     */
    draw(drawCb) {
      executor = function () {
        drawCb.call(sprite, ctx);
      }
    },
    /**
     * 绘制图片
     * @param {string} group 资源分组
     * @param {string} name 资源名
     * @param {boolean} sameSize 是否与图片相同尺寸
     */
    image(group, name, sameSize = false) {
      // 获取图片数据
      let image = Game.asset.get(group, name);

      setSize(image.width, image.height, sameSize);

      // 绘制函数
      executor = function () {
        drawImage(image);
      }
    },
    /**
     * 混合绘制(混合绘制是在另一个画布上绘制后再复制到原画布上，不会影响原画布)
     * @param {string} type 绘制类型
     * @param {Function} drawCb 绘制函数
     */
    mix(type, drawCb) {
      let mixCanvas = Game.canvas.cloneNode();
      let ctx = mixCanvas.getContext('2d');
      let mixImage = new Image();
      if (type === 'static') {
        ctx.clearRect(0, 0, Game.width, Game.height);
        drawCb(ctx);
        mixImage.src = mixCanvas.toDataURL("image/png");
        executor = function () {
          ctx.drawImage(mixImage, 0, 0);
        }
      } else if (type === 'dynamic') {
        executor = function () {
          ctx.clearRect(0, 0, Game.width, Game.height);
          drawCb(ctx);
          mixImage.src = mixCanvas.toDataURL("image/png");
          ctx.drawImage(mixImage, 0, 0);
        }
      }
    },
    /**
     * 绘制粒子
     * @param {string} group 资源分组
     * @param {string} name 资源名
     * @param {number} interval 间隔帧
     * @param {Array<number>} alphaRange 透明度范围
     * @param {Array<number>} scaleRange 缩放度范围
     */
    particle(group, name, interval, alphaRange, scaleRange) {
      let image = Game.asset.get(group, name);

      // 设置单位尺寸(粒子单位没有宽度和高度)
      sprite.width = 0;
      sprite.height = 0;
      sprite.drawWidth = image.width;
      sprite.drawHeight = image.height;

      // 设置粒子属性
      let nextAlpha, nextscale;

      // 检查粒子是否有透明度变化
      if (alphaRange) {
        nextAlpha = (alphaRange[1] - alphaRange[0]) / interval;
      }

      // 检查粒子是否有尺寸变化
      if (scaleRange) {
        nextscale = (scaleRange[1] - scaleRange[0]) / interval;
        sprite.scale = scaleRange[1];
      }

      executor = function () {
        // 透明度变化
        if (nextAlpha != null) {
          if (sprite.alpha + nextAlpha <= alphaRange[0] || sprite.alpha + nextAlpha >= alphaRange[1]) {
            nextAlpha = -nextAlpha;
          }
          sprite.alpha += nextAlpha;
        }

        // 尺寸变化
        if (nextscale != null) {
          if (sprite.scale + nextscale <= scaleRange[0] || sprite.scale + nextscale >= scaleRange[1]) {
            nextscale = - nextscale;
          }
          sprite.scale += nextscale;
        }

        drawImage(image);
      }
    },
    /**
     * 渲染
     */
    render() {
      let { relX, relY, width, height, scale, alpha } = sprite.scale;
      if (alpha <= 0) {
        sprite.alpha = 0;
        return;
      }
      if (relX + width * scale < 0 ||
        relX > Game.width ||
        relY + height * scale < 0 ||
        relY > Game.height) return;
      ctx.globalAlpha = alpha;
      executor && executor();
      Game.test && test();
    }
  }
}