import Appearance from "../interfaces/Appearance"
import Transfrom from "../interfaces/Transfrom"
import Game from "../game/Game"
import Pressed from "../signals/Pressed"
import MouseIn from "../signals/MouseIn"
import MouseOut from "../signals/MouseOut"
import SpriteSystem from "../systems/SpriteSystem"
import Color from "../interfaces/Color"
import Vector2 from "../interfaces/Vector2"
import UserInputEvent from "../variant_types/UserInputEvent"
import Canvas from "../canvas/Canvas";

/**
 * 精灵构造函数
 * @param {Object} options
 */
abstract class Sprite {
  readonly id: number = SpriteSystem.generateId()

  protected transform: Transfrom = {
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1 },
    flip: false
  }

  protected appearance: Appearance = {
    visible: true,
    modulate: { r: 1, g: 1, b: 1, a: 1 }
  }

  public set position(value: Vector2) {
    this.transform.position = value
  }

  public get position() {
    let realativePosition: Vector2 = {
      x: this.transform.position.x * this.scale.x * Game.canvas.scale,
      y: this.transform.position.y * this.scale.y * Game.canvas.scale
    }
    return realativePosition
  }

  public set size(value: Vector2) {
    this.transform.size = value
  }

  public get size() {
    let realativeSize: Vector2 = {
      x: this.transform.size.x * this.scale.x * Game.canvas.scale,
      y: this.transform.size.y * this.scale.y * Game.canvas.scale
    }
    return realativeSize
  }

  public set rotation(value: number) {
    this.transform.rotation = value
  }

  public get rotation() {
    return this.transform.rotation
  }

  public set scale(value: Vector2) {
    this.transform.scale = value
  }

  public get scale() {
    return this.transform.scale
  }

  public set visible(value: boolean) {
    this.appearance.visible = value
  }

  public get visible() {
    return this.appearance.visible
  }

  public set modulate(value: Color) {
    this.appearance.modulate = value
  }

  public get modulate() {
    return this.appearance.modulate
  }

  // 信号
  protected readonly pressed: Pressed = new Pressed()
  protected readonly mouseIn: MouseIn = new MouseIn()
  protected readonly mouseOut: MouseOut = new MouseOut()
  protected readonly _updateFn: Function = this._update.bind(this)
  protected readonly _inputFn: Function = this._input.bind(this)

  // 鼠标状态
  protected mouseStatus: string = "mouseup"
  protected isMouseIn: boolean = false

  constructor() {
    this._ready()
  }

  protected _ready(): void {
    Game.canvas.update.connect(this._updateFn)
    Game.canvas.userInput.connect(this._inputFn)
  }

  protected _input(event: UserInputEvent): void {
    if (event instanceof MouseEvent) {
      const point: Vector2 = { x: event.clientX, y: event.clientY }
      switch (event.type) {
        case "mousedown":
          if (this.has_point(point)) this.mouseStatus = event.type
          break;
        case "mouseup":
          if (this.mouseStatus == "mousedown" && this.has_point(point)) this.pressed.emit()
          this.mouseStatus = event.type
          break;
        case "mousemove":
          const has_point = this.has_point(point)
          if (has_point && !this.isMouseIn) {
            this.mouseIn.emit(event)
          }
          if (!has_point && this.isMouseIn) {
            this.mouseOut.emit(event)
          }
          this.isMouseIn = has_point
          break;
      }
    }
    this.onInput(event)
  }

  protected _update(delta: number): void {
    if (this.visible) this._render()
    this.onUpdate(delta)
  }

  protected abstract _render(): void

  protected _destroy(): void {
    Game.canvas.update.disconnect(this._updateFn)
    Game.canvas.userInput.disconnect(this._inputFn)
  }

  protected abstract onReady(): void

  protected abstract onUpdate(delta: number): void

  protected abstract onInput(event: UserInputEvent): void

  protected abstract onDestroy(): void

  public has_point(point: Vector2): boolean {
    if (point.x < this.position.x) return false
    if (point.x > this.position.x + this.size.x) return false
    if (point.y < this.position.y) return false
    if (point.y > this.position.y + this.size.x) return false
    return true
  }
}

export default Sprite