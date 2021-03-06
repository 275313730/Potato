/**
 * 检测是否为移动端
 */
export function isMobile() {
  const inBrowser = typeof window !== "undefined";
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isAndroid = (UA && UA.indexOf("android") > 0);
  const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
  if (isAndroid || isIOS) {
    return true;
  } else {
    return false;
  }
}

/**
 * 初始化页面样式
 */
export function initStyle() {
  let body = document.body;
  body.style.margin = 0;
  body.style.padding = 0;
  body.style.width = "100vw";
  body.style.height = "100vh";
  body.style.overflow = "hidden";
  body.style.display = "flex";
  body.style.alignItems = "center";
  body.style.justifyContent = "center";
}

/**
 * 监听用户事件
 * @param {Object} Game 游戏对象
 */
export function listenInputEvent(Game) {

  // 触屏事件
  if (Game.isMobile) {
    ["touchstart", "touchmove", "touchend"].forEach(function (eventType) {
      Game.canvas.addEventListener(eventType, function (e) {
        executeInputEvents(eventType, calTouch(e));
      });
    });
  } else {
    // 鼠标事件
    ["mousedown", "mouseup"].forEach(function (eventType) {
      Game.canvas.addEventListener(eventType, function (e) {
        e.stopPropagation();
        e.preventDefault();
        executeInputEvents(eventType, calMouse(e));
      });
    });
    // 键盘事件
    window.addEventListener("keydown", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const keyCode = e.keyCode;
      // F11默认为全屏键，无法修改
      if (keyCode === 122) return fullScreen();
      if (Game.keyCode === keyCode) return;
      Game.keyCode = keyCode;
      executeInputEvents("keydown", keyCode);
    });
    window.addEventListener("keyup", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const keyCode = e.keyCode;
      if (Game.keyCode === keyCode) {
        Game.keyCode = null;
      }
      executeInputEvents("keyup", keyCode);
    });
  }

  /**
    * 执行用户事件
    * @param {string} eventType 事件类型
    * @param {Number} keycode 键盘码
    */
  function executeInputEvents(eventType, keycode) {
    let events = Game.inputEvents;
    for (const key in events) {
      let event = events[key];
      if (!event[eventType]) continue;
      event[eventType](keycode);
    }
  }

  /**
    * 计算鼠标数据
    * @param {Object} e 鼠标数据
    */
  function calMouse(e) {
    const canvas = Game.canvas;
    // 计算画面缩放比例
    const scale = Game.scale;
    // 简化事件属性
    return {
      x: (e.clientX - canvas.offsetLeft) / scale,
      y: (e.clientY - canvas.offsetTop) / scale,
      button: e.button
    };
  }

  /**
   * 计算触控数据
   * @param {Object} e 触控数据
   */
  function calTouch(e) {
    const canvas = Game.canvas;
    const scale = Game.scale;
    let touches = [];
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches[i];
      touches.push({
        x: (touch.clientX - canvas.offsetLeft) / scale,
        y: (touch.clientY - canvas.offsetTop) / scale,
        id: touch.identifier,
        type: e.type
      });
    }
    return touches;
  }
}

/**
 * 实现全屏
 */
function fullScreen() {
  var el = document.documentElement;
  var rfs = el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  };
}

/**
 * 自适应画布
 * @param {Object} Game 游戏对象
 */
export function autoResizeCanvas(Game) {
  window.onresize = window.onload = function () {
    const ratio = Game.ratio;
    let width = document.body.clientWidth;
    let height = document.body.clientHeight;
    if (width / height > ratio) {
      Game.viewHeight = height;
      Game.viewWidth = ratio * height;
    } else {
      Game.viewWidth = width;
      Game.viewHeight = width / ratio;
    }
    Game.scale = Game.viewHeight / Game.height;
    // 设置canvas宽高
    Game.canvas.setAttribute("width", Game.viewWidth);
    Game.canvas.setAttribute("height", Game.viewHeight);
  }
}