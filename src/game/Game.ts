import Camera from "../canvas/Camera"
import Canvas from "../canvas/Canvas"
import { listenInputEvent, initStyle } from "../Utils"

class Game {
  protected static _canvas: Canvas

  public static get canvas(): Canvas {
    return this._canvas
  }

  protected static _canvasElement: HTMLCanvasElement

  public static get canvasElement() {
    return this._canvasElement
  }

  protected static _rendering: CanvasRenderingContext2D

  public static get rendering() {
    return this._rendering
  }

  protected static _camera: Camera

  public static get camera() {
    return this._camera
  }

  protected static paused = false
  protected static pausedCushion = false

  static isTestMode = false


  static init(canvasId: string) {
    initStyle()
    this._canvas = new Canvas(canvasId)
    this._canvasElement = this.canvas.canvasElement
    this._rendering = this.canvas.rendering
    this._camera = this.canvas.camera
    listenInputEvent(this.canvas)
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

  private static loop() {
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


}

export default Game