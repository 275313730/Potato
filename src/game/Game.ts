import Camera from "../canvas/Camera"
import Canvas from "../canvas/Canvas"
import { EventType } from "../enums"
import { Sprite } from "../sprites"
import { KeyboardInputEvent, MouseButtonEvent, MouseMotionEvent, Vector2 } from "../variant_types"

class Game {
  public readonly canvas: Canvas

  public readonly canvasElement: HTMLCanvasElement


  public readonly rendering: CanvasRenderingContext2D

  public readonly camera: Camera

  protected paused = false
  protected pausedCushion = false

  public isTestMode = false


  constructor(canvasId: string) {
    initStyle()
    this.canvas = new Canvas(canvasId)
    this.canvasElement = this.canvas.canvasElement
    this.rendering = this.canvas.rendering
    this.camera = this.canvas.camera
    listenInputEvent(this.canvas)
    this.pauseSetting()
    this.loop()
  }

  protected pauseSetting() {
    window.onblur = () => {
      this.paused = true
      this.pausedCushion = true
    }
    window.onfocus = () => {
      this.paused = false
    }
  }

  protected loop() {
    const startTime = new Date().getTime()
    // 刷新画布
    window.requestAnimationFrame(() => {
      let timePassed = (new Date().getTime() - startTime) / 1000
      if (!this.paused) {
        if (this.pausedCushion) {
          timePassed = 0
          this.pausedCushion = false
        }
        this.rendering.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height)
        this.canvas.update.emit(timePassed)
      }
      this.loop()
    });
  }

  public addSprite(sprite: Sprite) {
    sprite.canvas = this.canvas
    sprite.camera = this.camera
    this.canvas.update.connect(sprite.updateFn)
    this.canvas.userInput.connect(sprite.inputFn)
    for (let child of sprite.children) {
      this.addSprite(child)
    }
    sprite.ready()
  }

  public addSprites(sprites: Sprite[]) {
    for (let sprite of sprites) {
      this.addSprite(sprite)
    }
  }

  public removeSprite(sprite: Sprite) {
    sprite.canvas = null
    sprite.camera = null
    this.canvas.update.disconnect(sprite.updateFn)
    this.canvas.userInput.disconnect(sprite.inputFn)
  }
}

/**
 * 监听输入事件
 * @param canvas 画布 
 */
function listenInputEvent(canvas: Canvas) {
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
    ["mousedown", "mouseup"].forEach((eventType: string) => {
      window.addEventListener(eventType, (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const finalPosition = getFinalPosition(canvas, { x: e.clientX, y: e.clientY })
        if (finalPosition.x === -1 || finalPosition.y === -1) return
        const mouseButton: MouseButtonEvent = {
          altKey: e.altKey,
          button: e.button,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          type: EventType.MOUSE_BUTTON,
          status: eventType,
          position: {
            x: finalPosition.x,
            y: finalPosition.y
          }
        }
        canvas.userInput.emit(mouseButton)
      });
    })
    window.addEventListener("mousemove", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const finalPosition = getFinalPosition(canvas, { x: e.clientX, y: e.clientY })
      if (finalPosition.x === -1 || finalPosition.y === -1) return
      const mouseMotion: MouseMotionEvent = {
        type: EventType.MOUSE_MOTION,
        position: {
          x: finalPosition.x,
          y: finalPosition.y
        }
      }
      canvas.userInput.emit(mouseMotion)
    });
    ["keydown", "keyup"].forEach((eventType: string) => {
      window.addEventListener(eventType, (e: KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();
        // F11默认为全屏键，无法使用
        if (e.key === "F11") return
        const keyboardInput: KeyboardInputEvent = {
          altKey: e.altKey,
          code: e.code,
          ctrlKey: e.ctrlKey,
          isComposing: e.isComposing,
          key: e.key,
          location: e.location,
          metaKey: e.metaKey,
          repeat: e.repeat,
          shiftKey: e.shiftKey,
          status: eventType,
          type: EventType.KEYBOARD_INPUT
        }
        canvas.userInput.emit(keyboardInput)
      });
    })
  }
}

function getFinalPosition(canvas: Canvas, position: Vector2): Vector2 {
  let finalX = (position.x - canvas.canvasElement.offsetLeft) / canvas.scale
  let finalY = (position.y - canvas.canvasElement.offsetTop) / canvas.scale
  return { x: finalX, y: finalY }
}

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

function initStyle(): void {
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

export default Game