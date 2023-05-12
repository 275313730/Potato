import Update from "../signals/Update"
import UserInput from "../signals/UserInput"
import Vector2 from "../variant_types/Vector2"
import Game from "../game/Game"

class Canvas {
  readonly canvasElement: HTMLCanvasElement
  readonly rendering: CanvasRenderingContext2D
  public resolution: Vector2 = { x: 1920, y: 1080 }
  public viewSize: Vector2 = { x: 0, y: 0 }
  public animationInterval: number = 16
  public isTestMode: boolean = false

  public get ratio(): number {
    return this.resolution.x / this.resolution.y
  }

  public get scale(): number {
    return this.viewSize.y / this.resolution.y
  }

  // signals
  public readonly update: Update = new Update()
  public readonly userInput: UserInput = new UserInput()

  constructor(elementId: string = "") {
    if (elementId === "") {
      this.canvasElement = Game.canvas.canvasElement.cloneNode() as HTMLCanvasElement
    } else {
      this.canvasElement = document.getElementById(elementId) as HTMLCanvasElement
    }
    this.rendering = this.canvasElement.getContext("2d")

    window.onresize = window.onload = () => {
      this.resize()
    }

    this.resize()
    this.listenInputEvent();
    this.loop();
  }

  protected loop() {
    const startTime = new Date().getTime()

    // 刷新画布
    window.requestAnimationFrame(() => {
      // 清除canvas
      this.rendering.clearRect(0, 0, this.viewSize.x, this.viewSize.y);

      const endTime = new Date().getTime()
      this.update.emit((endTime - startTime) / 1000)
      
      this.loop()
    });
  }

  protected resize() {
    let width = document.body.clientWidth
    let height = document.body.clientHeight
    if (width / height > this.ratio) {
      this.viewSize.x = this.ratio * height;
      this.viewSize.y = height;
    } else {
      this.viewSize.x = width;
      this.viewSize.y = width / this.ratio;
    }
    this.canvasElement.setAttribute("width", this.viewSize.x.toString());
    this.canvasElement.setAttribute("height", this.viewSize.y.toString());
  }

  protected listenInputEvent() {
    // 触屏事件
    if (Game.isMobile()) {
      this.canvasElement.addEventListener("touchstart", (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      })
      this.canvasElement.addEventListener("touchmove", (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      })
      this.canvasElement.addEventListener("touchend", (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      })
    } else {
      this.canvasElement.addEventListener("mousedown", (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      });
      this.canvasElement.addEventListener("mouseup", (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      });
      this.canvasElement.addEventListener("mousemove", (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.userInput.emit(e)
      });
      this.canvasElement.addEventListener("keydown", (e: KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();
        // F11默认为全屏键，无法使用
        if (e.key === "F11") return
        this.userInput.emit(e)
      });
      this.canvasElement.addEventListener("keyup", (e: KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();
        // F11默认为全屏键，无法使用
        if (e.key === "F11") return
        this.userInput.emit(e)
      });
    }
  }
}

export default Canvas