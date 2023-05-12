import Canvas from "./canvas/Canvas";
import MouseMotion from "./variant_types/MouseMotion";
import MouseButton from "./variant_types/MouseButton";
import KeyboardInput from "./variant_types/KeyboardInput";
import EventType from "./enums/EventType";
import Vector2 from "./variant_types/Vector2";

function isMobile(): boolean {
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

export function listenInputEvent(canvas: Canvas) {
  // 触屏事件
  if (isMobile()) {
    /*     canvas.canvasElement.addEventListener("touchstart", (e: TouchEvent) => {
          e.stopPropagation();
          e.preventDefault();
          canvas.userInput.emit(e)
        })
        canvas.canvasElement.addEventListener("touchmove", (e: TouchEvent) => {
          e.stopPropagation();
          e.preventDefault();
          canvas.userInput.emit(e)
        })
        canvas.canvasElement.addEventListener("touchend", (e: TouchEvent) => {
          e.stopPropagation();
          e.preventDefault();
          canvas.userInput.emit(e)
        }) */
  } else {
    canvas.canvasElement.addEventListener("mousedown", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const finalPosition = getFinalPosition(canvas, { x: e.clientX, y: e.clientY })
      if (finalPosition.x === -1 || finalPosition.y === -1) return
      const mouseButton: MouseButton = {
        altKey: e.altKey,
        button: e.button,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        type: EventType.MOUSE_BUTTON,
        status: "mousedown",
        position: {
          x: finalPosition.x,
          y: finalPosition.y
        }
      }
      canvas.userInput.emit(mouseButton)
    });
    canvas.canvasElement.addEventListener("mouseup", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const finalPosition = getFinalPosition(canvas, { x: e.clientX, y: e.clientY })
      if (finalPosition.x === -1 || finalPosition.y === -1) return
      const mouseButton: MouseButton = {
        altKey: e.altKey,
        button: e.button,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        type: EventType.MOUSE_BUTTON,
        status: "mouseup",
        position: {
          x: finalPosition.x,
          y: finalPosition.y
        }
      }
      canvas.userInput.emit(mouseButton)
    });
    canvas.canvasElement.addEventListener("mousemove", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const finalPosition = getFinalPosition(canvas, { x: e.clientX, y: e.clientY })
      if (finalPosition.x === -1 || finalPosition.y === -1) return
      const mouseMotion: MouseMotion = {
        type: EventType.MOUSE_MOTION,
        position: {
          x: finalPosition.x,
          y: finalPosition.y
        }
      }
      canvas.userInput.emit(mouseMotion)
    });
    canvas.canvasElement.addEventListener("keydown", (e: KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      // F11默认为全屏键，无法使用
      if (e.key === "F11") return
      const keyboardInput: KeyboardInput = {
        altKey: e.altKey,
        code: e.code,
        ctrlKey: e.ctrlKey,
        isComposing: e.isComposing,
        key: e.key,
        location: e.location,
        metaKey: e.metaKey,
        repeat: e.repeat,
        shiftKey: e.shiftKey,
        type: EventType.KEYBOARD_INPUT,
        status: "keydown"
      }
      canvas.userInput.emit(keyboardInput)
    });
    canvas.canvasElement.addEventListener("keyup", (e: KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      // F11默认为全屏键，无法使用
      if (e.key === "F11") return
      const keyboardInput: KeyboardInput = {
        altKey: e.altKey,
        code: e.code,
        ctrlKey: e.ctrlKey,
        isComposing: e.isComposing,
        key: e.key,
        location: e.location,
        metaKey: e.metaKey,
        repeat: e.repeat,
        shiftKey: e.shiftKey,
        status: "keyup",
        type: EventType.KEYBOARD_INPUT
      }
      canvas.userInput.emit(keyboardInput)
    });
  }
}

function getFinalPosition(canvas: Canvas, position: Vector2): Vector2 {
  let finalX = (position.x - canvas.canvasElement.offsetLeft) / canvas.scale
  if (finalX < 0) finalX = 0
  if (finalX > canvas.resolution.x) finalX = -1
  let finalY = (position.y - canvas.canvasElement.offsetTop) / canvas.scale
  if (finalY < 0) finalY = 0
  if (finalY > canvas.resolution.y) finalY = -1
  return { x: finalX, y: finalY }
}

export function initStyle(): void {
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