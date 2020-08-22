import Game from '../Game/index.js'
import Sprite from '../Sprite/index.js';

let spritesCache = {}

export default function sprite(stage) {
  let sprites = Object.assign({}, spritesCache);
  // 图层数组
  let layers = [];
  // 检测id是否存在
  function checkId(id) {
    if (sprites[id]) throw new Error(`Sprite '${id}' exists.`);
  }
  // 将精灵排序
  function spritesSort() {
    let newSprites = {};
    // 根据图层值排序
    layers.forEach(layer => {
      for (const key in sprites) {
        const sprite = sprites[key];
        if (sprite.layer === layer) {
          newSprites[sprite.id] = sprite;
        }
      }
    })
    sprites = newSprites;
  }
  // 添加game和stage属性
  function addProperty(newSprite) {
    // Game和Stage的宽高
    newSprite.game = {
      width: Game.width,
      height: Game.height
    };
    // 全局精灵无法使用stage属性
    if (newSprite.global) return;
    newSprite.stage = {
      width: stage.width,
      height: stage.height
    };
  }
  // 检查图层值
  function checkLayer(layer) {
    // 检测图层值是否在数组中
    if (layers.indexOf(layer) > -1) return;
    // 新增图层值
    layers.push(layer);
    // 图层值排序
    layers.sort();
  }
  return {
    /**
     * 添加新精灵
     * @param {Sprite} newSprite 
     */
    add(newSprite) {
      checkId(newSprite.id);
      sprites[newSprite.id] = newSprite;
      addProperty(newSprite);
      checkLayer(newSprite.layer);
      spritesSort();
      return newSprite;
    },
    /**
     * 删除精灵
     * @param {string} id 精灵id
     */
    del(id) {
      var _sprite = sprites[id];
      if (!_sprite) throw new Error(`sprite ${id} doesn't exist`);
      _sprite.beforeDestroy && _sprite.beforeDestroy();
      delete Game.inputEvents[id];
      _sprite.audio.clear();
      delete sprites[id];
      _sprite.destroyed && _sprite.destroyed();
    },
    /**
     * 删除所有精灵
     * @param {boolean} includeGlobal 是否包括全局精灵
     */
    clear(includeGlobal) {
      for (var key in sprites) {
        var _sprite = sprites[key];
        if (!includeGlobal && _sprite.global) {
          spritesCache[key] = _sprite;
          continue;
        };
        this.del(key);
      }
    },
    /**
     * 查找精灵
     * @param {string} id 
     */
    find(id) {
      return sprites[id];
    },
    /**
     * 过滤符合条件的精灵(类似Array.prototype.filter)
     * @param {Function} callback 
     */
    filter(callback) {
      let newSprites = {};

      for (const key in sprites) {
        const _sprite = sprites[key];
        if (callback(_sprite) === false) continue;
        newSprites[key] = _sprite;
      }

      return newSprites;
    },
    /**
     * 遍历精灵并执行回调函数(类似Array.prototype.forEach)
     * @param {Function} callback 
     */
    travel(callback) {
      for (var key in sprites) {
        // 回调函数返回false时停止遍历
        if (callback(sprites[key]) === false) break;
      }
    },
  }
}