import InputMouseButton from "../signals/InputMouseButton"
import InputMouseMotion from "../signals/InputMouseMotion"
import Update from "../signals/Update"
import Sprite from "../sprites/Sprite"

import Vector2 from "../variant_types/Vector2"
import { initStyle, isMobile, autoResizeCanvas, listenInputEvent } from "./Utils"

let sprites: Sprite[] = []

class Game {
  static canvas: HTMLCanvasElement
  static context: CanvasRenderingContext2D
  static resolution: Vector2 = { x: 1920, y: 1080 }
  static viewSize: Vector2
  static ratio: number
  static scale: number
  static keycode: number = null
  static inputEvents: any = {}
  static animationInterval: number = 16
  static isTestMode: boolean = false
  static isMobile: boolean = false

  // signals
  static update: Update = new Update()
  static inputMouseButton: InputMouseButton = new InputMouseButton()
  static inputMouseMotion: InputMouseMotion = new InputMouseMotion()

  static init(document: Document) {
    initStyle();

    this.canvas = document.getElementById("potato") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d")

    this.viewSize = { x: this.canvas.clientWidth, y: this.canvas.clientWidth }

    // 原始比例
    this.ratio = this.resolution.x / this.resolution.y

    // canvas黑色背景
    this.canvas.style.backgroundColor = "#0b7e87";

    // 缩放
    this.scale = this.viewSize.y / this.resolution.y;

    // 是否移动端
    this.isMobile = isMobile();

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