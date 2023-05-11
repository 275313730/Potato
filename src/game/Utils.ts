import Game from "./Game";

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
  body.style.margin = "0";
  body.style.padding = "0";
  body.style.width = "100vw";
  body.style.height = "100vh";
  body.style.overflow = "hidden";
  body.style.display = "flex";
  body.style.alignItems = "center";
  body.style.justifyContent = "center";
}

/**
 * 监听用户事件
 */
export function listenInputEvent() {
  // 触屏事件
  if (Game.isMobile) {
    ["touchstart", "touchmove", "touchend"].forEach(function (eventType: string) {
      Game.canvas.addEventListener(eventType, function (e: TouchEvent) {
        e.stopPropagation();
        e.preventDefault();
        Game.userInput.emit(e)
      });
    });
  } else {
    // 鼠标事件
    ["mousedown", "mouseup", "mousemove"].forEach(function (eventType: string) {
      Game.canvas.addEventListener(eventType, function (e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        Game.userInput.emit(e)
      });
    });

    // 键盘事件
    ["keydown", "keyup"].forEach(function (eventType: string) {
      window.addEventListener(eventType, function (e: KeyboardEvent) {
        e.stopPropagation();
        e.preventDefault();
        // F11默认为全屏键，无法使用
        if (e.key === "F11") return
        Game.userInput.emit(e)
      });
    })

  }

  /**
    * 计算鼠标数据
    * @param {MouseEvent} e 鼠标数据
    */
  function calMouse(e: MouseEvent) {
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
   * @param {TouchEvent} e 触控数据
   */
  function calTouch(e: TouchEvent) {
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
  let el: any = document.documentElement;
  let rfs = el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  };
}

/**
 * 自适应画布
 */
export function autoResizeCanvas() {
  resize()
  window.onresize = window.onload = function () {
    resize()
  }
}

function resize() {
  const ratio = Game.ratio;
  let width = document.body.clientWidth;
  let height = document.body.clientHeight;
  if (width / height > ratio) {
    Game.viewSize.y = height;
    Game.viewSize.x = ratio * height;
  } else {
    Game.viewSize.x = width;
    Game.viewSize.y = width / ratio;
  }
  Game.scale = Game.viewSize.y / Game.resolution.y;
  
  Game.canvas.setAttribute("width", Game.viewSize.x.toString());
  Game.canvas.setAttribute("height", Game.viewSize.y.toString());
}