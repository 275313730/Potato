"use strict"
import Stage from "../stage/Stage.js";
import Vector2 from "../variant_types/Vector2.js";
import AssetSystem from "../systems/AssetSystem.js";
import { initStyle, isMobile, autoResizeCanvas, listenInputEvent } from "./Utils.js";
import Update from "../signals/Update.js";
import InputMouseButton from "../signals/InputMouseButton.js";
import InputMouseMotion from "../signals/InputMouseMotion.js";


class Game {
  static canvas: HTMLCanvasElement = document.createElement("canvas")
  static context: CanvasRenderingContext2D = this.canvas.getContext("2d")
  static size: Vector2 = { x: document.body.clientWidth, y: document.body.clientHeight }
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

  static stage: Stage = null;

  /**
   *
   */
  static init(options: { size?: Vector2, animationInterval: number, isTestMode: boolean, publicPath: string }) {
    initStyle();

    // 初始化宽度和高度
    let defaultRatio = this.size.x / this.size.y;

    if (options.size) {
      this.size = this.viewSize = options.size
    } else {
      this.viewSize = this.size
    }
    this.ratio = this.size.x / this.size.y;

    if (this.ratio > defaultRatio) {
      this.viewSize.x = this.size.x;
      this.viewSize.y = this.size.y / this.ratio;
    } else {
      this.viewSize.x = this.size.x;
      this.viewSize.y = this.size.y * this.ratio;
    }

    // 设置canvas宽高
    this.canvas.setAttribute("width", this.viewSize.x.toString());
    this.canvas.setAttribute("height", this.viewSize.y.toString());

    // canvas黑色背景
    this.canvas.style.backgroundColor = "black";

    // 缩放
    this.scale = this.viewSize.y / this.size.y;

    // 动画间隔帧(每隔n帧绘制下一个关键帧)
    if (options.animationInterval) {
      this.animationInterval = options.animationInterval
    }

    // 测试模式
    this.isTestMode = options.isTestMode;

    // 是否移动端
    this.isMobile = isMobile();

    // 资源路径
    AssetSystem.setPath(options.publicPath);

    autoResizeCanvas();
    listenInputEvent();

    // 禁用右键菜单
    if (!this.isTestMode) window.oncontextmenu = () => { return false }
  }
}

export default Game