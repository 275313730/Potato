"use strict"
import Game from "../game/Game.js";
import { AssetReady } from "../systems/AssetSystem.js";
import Vector2 from "../variant_types/Vector2.js";
import Sprite from "../sprites/Sprite.js";

/**
 * 场景构造函数
 * @param {Object} options
 */
class Stage {
  size: Vector2 = Game.size
  stop: boolean = false

  camera: any
  geometry: any

  sprites: Sprite[] = []


  constructor(options?: { size: Vector2 }) {
    AssetReady(() => {
      // 销毁场景
      Game.stage && Game.stage.destory();

      // 清空按键
      Game.keycode = null;

      // 改变当前场景
      Game.stage = this;

      const { size } = options

      // 初始化场景数据
      if (size) this.size = size

      this.stop = false;

      // 进入循环
      this.loop();
    });
  }

  addSprite(sprite:Sprite){
    this.sprites.push(sprite)
  }

  /**
  * 场景销毁
  */
  destory() {
    // 退出循环
    this.stop = true;

  }

  loop() {
    if (this.stop) return;
    
    for(let sprite of this.sprites){
      if(sprite.appearance.visible){
        sprite
      }
    }

    // 清除canvas
    Game.context.clearRect(0, 0, Game.size.x, Game.size.y);

    // 刷新画布
    window.requestAnimationFrame(() => this.loop());
  }
}

export default Stage