import Update from "../signals/Update"
import { initStyle, isMobile, autoResizeCanvas, listenInputEvent } from "./Utils"
import UserInput from "../signals/UserInput"
import Vector2 from "../interfaces/Vector2"

class Game {
  static readonly canvas: HTMLCanvasElement = document.getElementById("potato") as HTMLCanvasElement
  static readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d")
  static resolution: Vector2 = { x: 1920, y: 1080 }
  static viewSize: Vector2 = { x: this.canvas.clientWidth, y: this.canvas.clientWidth }
  static ratio: number
  static scale: number
  static animationInterval: number = 16
  static isTestMode: boolean = false
  static readonly isMobile: boolean = isMobile()

  // signals
  static readonly update: Update = new Update()
  static readonly userInput: UserInput = new UserInput()

  static init() {
    initStyle();

    // 原始比例
    this.ratio = this.resolution.x / this.resolution.y

    // canvas黑色背景
    this.canvas.style.backgroundColor = "#0b7e87";

    autoResizeCanvas();
    listenInputEvent();

    loop();

    // 禁用右键菜单
    if (!this.isTestMode) window.oncontextmenu = () => { return false }
  }
}

function loop() {
  const startTime = new Date().getTime()

  // 刷新画布
  window.requestAnimationFrame(() => {
    // 清除canvas
    Game.context.clearRect(0, 0, Game.viewSize.x, Game.viewSize.y);

    const endTime = new Date().getTime()
    Game.update.emit((endTime - startTime) / 1000)
    loop()
  });


}

export default Game