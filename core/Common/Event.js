/**
 * 通用事件系统
 * @param {Object} obj 
 */
export default function event(obj) {
  let events = {};

  return {
    /**
     * 添加事件
     * @param {string} name 
     * @param {Function} fn 
     */
    add(name, fn) {
      // 判断事件是否存在
      if (events[name]) return;
      // 添加事件
      events[name] = { fn, status: true };
    },
    /**
     * 删除事件
     * @param {string} name 
     */
    del(name) {
      // 判断事件是否存在
      if (!events[name]) return;
      // 删除事件
      delete events[name];
    },
    /**
     * 启用事件
     * @param {string} name 
     */
    enable(name) {
      const event = events[name]
      // 判断事件是否存在
      if (!event) return;
      // 启用事件
      event.status = true;
    },
    /**
     * 禁用事件
     * @param {string} name 
     */
    disable(name) {
      const event = events[name]
      // 判断事件是否存在
      if (!event) return;
      // 启用事件
      event.status = false;
    },
    /**
     * 删除所有事件
     */
    clear() {
      events = {};
    },
    /**
     * 执行事件
     */
    execute() {
      for (const key in events) {
        const event = events[key];
        // 检查事件是否被禁用
        event.status && event.fn.call(obj);
      }
    }
  }
}