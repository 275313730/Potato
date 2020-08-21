import Game from "../Game/Game.js"

export default function input(sprite) {
  let inputEvents = Game.inputEvents;

  return {
    // 监听
    watch(eventType, callback) {
      // 为精灵创建独立事件
      if (!inputEvents[sprite.id]) inputEvents[sprite.id] = {};

      // 添加事件到输入事件中
      inputEvents[sprite.id][eventType] = callback.bind(sprite);
    },
    // 解除监听
    unwatch(eventType) {
      // 判断用户事件是否存在
      if (!eventType || !inputEvents[sprite.id] || !inputEvents[sprite.id][eventType]) return;

      // 解除监听
      delete Game.inputEvents[sprite.id][eventType];
    }
  };
}