"use strict"
import Game from "../Game/Game.js";
import sprite from "./Sprite.js";
import camera from "./Camera.js";
import event from "../Common/Event.js";
import geometry from "./Geometry.js";

/**
 * 场景构造函数
 * @param {Object} options
 */
class Stage {
  constructor(options) {
    Game.asset.onReady(() => {
      // 销毁场景
      Game.stage && Game.stage.destory();

      // 初始化生命周期函数
      this.beforeCreate = options.beforeCreate;
      this.created = options.created;
      this.beforeUpdate = options.beforeUpdate;
      this.updated = options.updated;
      this.beforeDestroy = options.beforeDestroy;
      this.destoryed = options.destoryed;

      // 创建前函数
      this.beforeCreate && this.beforeCreate();

      // 清空按键
      Game.key = null;

      // 改变当前场景
      Game.stage = this;

      // 初始化场景数据
      var config = options.config;
      this.width = (config && config.width) || Game.width;
      this.height = (config && config.height) || Game.height;
      this.stop = false;

      // 初始化实例方法
      this.sprite = sprite(this);
      this.camera = camera(this);
      this.event = event(this);
      this.geometry = geometry();

      // 混入
      if (Stage.mixins) {
        Stage.mixins.forEach(function (mixin) {
          mixin.call(this);
        });
      }

      // 创建后函数
      this.created && this.created.call(this);

      // 进入循环
      loop(this);
    });
  }

  /**
  * 场景销毁
  */
  destory() {
    // 销毁前函数
    this.beforeDestroy && this.beforeDestroy();

    // 退出循环
    this.stop = true;

    // 清空场景单位
    Game.sprite.clear();

    // 销毁后函数
    this.destoryed && this.destoryed();
  }
}

/**
 * 场景循环
 * @param {Stage} stage 
 */
function loop(stage) {
  if (stage.stop) return;

  // 更新前函数
  stage.beforeUpdate && stage.beforeUpdate();

  // 获取镜头数据
  var camera = stage.camera.update();

  // 执行游戏事件
  Game.event.execute();

  // 执行场景事件
  stage.event.execute();

  // 清除canvas
  Game.context.clearRect(0, 0, Game.width, Game.height);

  // 执行单位渲染和事件
  stage.sprite.travel(sprite => {
    unitExecute(sprite, camera);
  })

  // 更新后函数
  stage.updated && stage.updated();

  // 刷新画布
  window.requestAnimationFrame(() => loop(stage));
}

/**
 * 执行单位渲染和事件
 * @param {Sprite} sprite 
 * @param {Object} camera 
 */
function unitExecute(sprite, camera) {
  // 更新前函数
  sprite.beforeUpdate && sprite.beforeUpdate();
  // 计算相对位置
  sprite.relX = sprite.x - camera.x * (1 - sprite.fixed);
  sprite.relY = sprite.y - camera.y * (1 - sprite.fixed);
  // 更新音频
  sprite.audio.update();
  // 绘制画面
  sprite.graphics.render();
  // 执行事件
  sprite.event.execute();
  // 更新后函数
  sprite.updated && sprite.updated();
}

export default Stage