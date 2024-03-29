import Camera from '../canvas/Camera';
import Canvas from '../canvas/Canvas';
import Renderer from '../canvas/Renderer';
import EventType from '../enums/EventType';
import KeyboardInputEvent from '../variant_types/KeyboardInput';
import MouseEventInput from '../variant_types/MouseEventInput';
import Vector2 from '../variant_types/Vector2';

export default class Game {
  public static assetPath: string = './assets/';
  protected static spriteID: number = 10000;
  protected static lastTime: number = 0
  protected static fps: number = 0

  private static _canvas: Canvas;

  public static get canvas() {
    return this._canvas;
  }

  public static get resolution() {
    return this._canvas.resolution
  }

  public static set resolution(value: Vector2) {
    this._canvas.resolution = value;
  }

  private static _canvasElement: HTMLCanvasElement;

  public static get canvasElement() {
    return this._canvasElement;
  }

  private static _renderer: Renderer;

  public static get renderer() {
    return this._renderer;
  }

  private static _camera: Camera;

  public static get camera() {
    return this._camera;
  }

  private static _start: boolean = false;

  public static get start() {
    return this._start;
  }

  protected static paused: boolean = false;
  protected static pausedCushion: boolean = false;

  public static generate(canvasId: string, resolution: Vector2) {
    this._canvas = new Canvas(canvasId, resolution);
    this._canvasElement = this.canvas.canvasElement;
    this._renderer = this.canvas.renderer;
    this._camera = this.canvas.camera;

    this.listenInputEvent();
    this.pauseSetting();
    this.lastTime = new Date().getTime()
    this.loop();
  }

  public static generateId(): number {
    return this.spriteID++;
  }

  protected static pauseSetting() {
    window.onblur = () => {
      this.paused = true;
      this.pausedCushion = true;
      this.canvas.pause.emit();
    };
    window.onfocus = () => {
      this.paused = false;
    };
  }

  protected static loop() {
    window.requestAnimationFrame(() => {
      this.fps = Math.round(1 / delta)
      this.loop()
    })

    const currentTime = new Date().getTime()
    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime

    // 刷新画布
    if (!this.start) return
    if (!this.paused) {
      if (this.pausedCushion) {
        delta = 0;
        this.pausedCushion = false;
        this.canvas.resume.emit();
      }
      this.renderer.clear({ x: this.canvas.viewSize.x, y: this.canvas.viewSize.y });
      this.canvas.update.emit(delta);
      this.canvas.render.emit(delta);
    }
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
      let mouseStatus: string = '';
      window.addEventListener('mousedown', (e: MouseEvent) => {
        this._start = true;
        const finalPosition = getFinalPosition(this.canvas, { x: e.clientX, y: e.clientY });
        if (finalPosition.x === -1 || finalPosition.y === -1) return;
        mouseStatus = 'mousedown';
        const mouseEventInput: MouseEventInput = {
          altKey: e.altKey,
          button: e.button,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          type: EventType.MOUSE_BUTTON,
          status: 'mousedown',
          position: {
            x: finalPosition.x,
            y: finalPosition.y,
          },
        };
        this.canvas.userInput.emit(mouseEventInput);
      });
      window.addEventListener('mouseup', (e: MouseEvent) => {
        this._start = true;
        const finalPosition = getFinalPosition(this.canvas, { x: e.clientX, y: e.clientY });
        if (finalPosition.x === -1 || finalPosition.y === -1) return;
        mouseStatus = 'mouseup';
        const mouseEventInput: MouseEventInput = {
          altKey: e.altKey,
          button: e.button,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          type: EventType.MOUSE_BUTTON,
          status: 'mouseup',
          position: {
            x: finalPosition.x,
            y: finalPosition.y,
          },
        };
        this.canvas.userInput.emit(mouseEventInput);
      });
      window.addEventListener('mousemove', (e: MouseEvent) => {
        const finalPosition = getFinalPosition(this.canvas, { x: e.clientX, y: e.clientY });
        if (finalPosition.x === -1 || finalPosition.y === -1) return;
        const mouseEventInput: MouseEventInput = {
          altKey: e.altKey,
          button: e.button,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          type: EventType.MOUSE_MOTION,
          status: mouseStatus,
          position: {
            x: finalPosition.x,
            y: finalPosition.y,
          },
        };
        this.canvas.userInput.emit(mouseEventInput);
      });
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        // F11默认为全屏键，无法使用
        if (e.key === 'F11') return;
        // 禁用保存
        if (e.key === 's' && e.ctrlKey) {
          e.stopPropagation();
          e.preventDefault();
        }
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
          status: 'keydown',
          type: EventType.KEYBOARD_INPUT,
        };
        this.canvas.userInput.emit(keyboardInput);
      });
      window.addEventListener('keyup', (e: KeyboardEvent) => {
        // F11默认为全屏键，无法使用
        if (e.key === 'F11') return;
        // 禁用保存
        if (e.key === 's' && e.ctrlKey) {
          e.stopPropagation();
          e.preventDefault();
        }
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
          status: 'keyup',
          type: EventType.KEYBOARD_INPUT,
        };
        this.canvas.userInput.emit(keyboardInput);
      });
    }
  }
}

function getFinalPosition(canvas: Canvas, position: Vector2): Vector2 {
  const finalX = (position.x - canvas.canvasElement.offsetLeft) / canvas.scale;
  const finalY = (position.y - canvas.canvasElement.offsetTop) / canvas.scale;
  return { x: finalX, y: finalY };
}

function isMobile(): boolean {
  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isAndroid = UA && UA.indexOf('android') > 0;
  const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  if (isAndroid || isIOS) {
    return true;
  } else {
    return false;
  }
}
