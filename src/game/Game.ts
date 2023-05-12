import Canvas from "../canvas/Canvas"
import { listenInputEvent, initStyle } from "../Utils"

class Game {
  static canvas: Canvas
  static canvasElement: HTMLCanvasElement
  static rendering: CanvasRenderingContext2D

  static init(canvasId: string) {
    initStyle()
    this.canvas = new Canvas(canvasId)
    this.canvasElement = this.canvas.canvasElement
    this.rendering = this.canvas.rendering
    listenInputEvent(this.canvas)
    this.rendering.fillStyle = "black"
    this.loop()
  }

  private static loop() {
    const startTime = new Date().getTime()
    // 刷新画布
    window.requestAnimationFrame(() => {
      // 清除canvas
      const endTime = new Date().getTime()
      this.rendering.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height)
      this.canvas.update.emit((endTime - startTime) / 1000)
      this.loop()
    });
  }


}

export default Game