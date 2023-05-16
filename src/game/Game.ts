import Camera from "../canvas/Camera"
import Canvas from "../canvas/Canvas"
import { EventType } from "../enums"
import { Sprite } from "../sprites"
import { KeyboardInputEvent, MouseButtonEvent, MouseMotionEvent, Vector2 } from "../variant_types"
import AssetSystem from "./AssetSystem"
import SpriteSystem from "./SpriteSystem"

class Game {
  private static _canvas: Canvas

  public static get canvas() {
    return this._canvas
  }

  public static set resolution(value: Vector2) {
    this._canvas.resolution = value
  }

  private static _canvasElement: HTMLCanvasElement

  public static get canvasElement() {
    return this._canvasElement
  }

  private static _rendering: CanvasRenderingContext2D

  public static get rendering() {
    return this._rendering
  }

  private static _camera: Camera

  public static get camera() {
    return this._camera
  }

  private static _start: boolean = false

  public static get start() {
    return this._start
  }

  private static _assetSystem = AssetSystem

  public static get AssetSystem() {
    return this._assetSystem
  }

  private static _spriteSystem = SpriteSystem

  public static get SpriteSystem() {
    return this._spriteSystem
  }

  public static isTestMode: boolean = false

  protected static paused: boolean = false
  protected static pausedCushion: boolean = false

  public static generate(canvasId: string) {
    initStyle()
    this._canvas = new Canvas(canvasId)
    this._canvasElement = this.canvas.canvasElement
    this._rendering = this.canvas.rendering
    this._camera = this.canvas.camera
    this.listenInputEvent()
    this.pauseSetting()
    this.loop()
  }


  protected static pauseSetting() {
    window.onblur = () => {
      this.paused = true
      this.pausedCushion = true
    }
    window.onfocus = () => {
      this.paused = false
    }
  }

  protected static loop() {
    const startTime = new Date().getTime()
    // 刷新画布
    window.requestAnimationFrame(() => {
      if (!this.start) return this.loop()
      let timePassed = (new Date().getTime() - startTime) / 1000
      if (this.paused) {
        this.canvas.pause.emit()
      } else {
        if (this.pausedCushion) {
          timePassed = 0
          this.pausedCushion = false
          this.canvas.resume.emit()
        }
        this.rendering.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height)
        this.canvas.update.emit(timePassed)
      }
      this.loop()
    });
  }

  public static addSprite(sprite: Sprite) {
    this.canvas.update.connect(sprite.updateFn)
    this.canvas.userInput.connect(sprite.inputFn)
    this.canvas.pause.connect(sprite.pauseFn)
    this.canvas.resume.connect(sprite.resumeFn)
    for (let child of sprite.children) {
      this.addSprite(child)
    }
    sprite._ready()
  }

  public static addSprites(sprites: Sprite[]) {
    for (let sprite of sprites) {
      this.addSprite(sprite)
    }
  }

  public static removeSprite(sprite: Sprite) {
    this.canvas.update.disconnect(sprite.updateFn)
    this.canvas.userInput.disconnect(sprite.inputFn)
  }

  /**
   * 监听输入事件
   * @param canvas 画布 
   */
  protected static listenInputEvent() {
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
          this._start = true
          e.stopPropagation();
          e.preventDefault();
          const finalPosition = getFinalPosition(this.canvas, { x: e.clientX, y: e.clientY })
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
          this.canvas.userInput.emit(mouseButton)
        });
      })
      window.addEventListener("mousemove", (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const finalPosition = getFinalPosition(this.canvas, { x: e.clientX, y: e.clientY })
        if (finalPosition.x === -1 || finalPosition.y === -1) return
        const mouseMotion: MouseMotionEvent = {
          type: EventType.MOUSE_MOTION,
          position: {
            x: finalPosition.x,
            y: finalPosition.y
          }
        }
        this.canvas.userInput.emit(mouseMotion)
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
          this.canvas.userInput.emit(keyboardInput)
        });
      })
    }
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