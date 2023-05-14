import Appearance from "../variant_types/Appearance"
import Transform from "../variant_types/Transform"
import Game from "../game/Game"
import Pressed from "../signals/Pressed"
import MouseIn from "../signals/MouseIn"
import MouseOut from "../signals/MouseOut"
import SpriteSystem from "../systems/SpriteSystem"
import Color from "../variant_types/Color"
import Vector2 from "../variant_types/Vector2"
import MouseFilter from "../enums/MouseFilter";
import UserInputEvent from "../variant_types/UserInputEvent"
import MouseMotion from "../variant_types/MouseMotion"
import MouseButton from "../variant_types/MouseButton"
import EventType from "../enums/EventType"
import LocateMode from "../enums/LocateMode"

/**
 * 精灵构造函数
 * @param {Object} options
 */
export default class Sprite {
  readonly id: number = SpriteSystem.generateId()

  protected transform = new Transform()

  protected appearance: Appearance = {
    visible: true,
    modulate: { r: 255, g: 255, b: 255, a: 1 }
  }

  public set position(value: Vector2) {
    this.transform.position = value
  }

  public get position() {
    return this.transform.position
  }

  public set size(value: Vector2) {
    this.transform.size = value
  }

  public get size() {
    return this.transform.size
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

  public get locateMode() {
    return this.transform.locateMode
  }

  public set locateMode(value: LocateMode) {
    this.transform.locateMode = value
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

  /**
   * 鼠标穿透属性
   */
  public mouseFilter: MouseFilter = MouseFilter.STOP

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
    this.onReady()
  }

  protected _input(event: UserInputEvent): void {
    if (event.type === EventType.MOUSE_BUTTON) {
      const mouseButton = event as MouseButton
      if (mouseButton.status == "mousedown" && this.isMouseIn) this.mouseStatus = mouseButton.status
      if (mouseButton.status == "mouseup") {
        if (this.mouseStatus === "mousedown" && this.isMouseIn) this.pressed.emit()
        this.mouseStatus = mouseButton.status
      }
    } else if (event.type === EventType.MOUSE_MOTION) {
      const mouseMotion = event as MouseMotion
      const has_point = this.has_point(mouseMotion.position)
      if (has_point && !this.isMouseIn) {
        this.mouseIn.emit()
      }
      if (!has_point && this.isMouseIn) {
        this.mouseOut.emit()
      }
      this.isMouseIn = has_point
    }
    this.onInput(event)
  }

  protected _update(delta: number): void {
    this.beforeRender()
    if (this.visible) this._render()
    this.onUpdate(delta)
  }

  protected _render(): void { }

  public destroy(): void {
    this.beforeDestroy()
    this._destroy()
  }

  protected _destroy(): void {
    Game.canvas.update.disconnect(this._updateFn)
    Game.canvas.userInput.disconnect(this._inputFn)
  }

  protected onReady(): void { }

  protected beforeRender(): void { }

  protected onUpdate(delta: number): void { }

  protected onInput(event: UserInputEvent): void { }

  protected beforeDestroy(): void { }

  public has_point(point: Vector2): boolean {
    switch (this.locateMode) {
      case LocateMode.ABSOLUTE:
        if (point.x < this.position.x) return false
        if (point.x > this.position.x + this.size.x * this.scale.x) return false
        if (point.y < this.position.y) return false
        if (point.y > this.position.y + this.size.y * this.scale.y) return false
        return true
      case LocateMode.REALATIVE:
        if (point.x + Game.camera.position.x < this.position.x) return false
        if (point.x + Game.camera.position.x > this.position.x + this.size.x * this.scale.x) return false
        if (point.y + Game.camera.position.y < this.position.y) return false
        if (point.y + Game.camera.position.y > this.position.y + this.size.y * this.scale.y) return false
        return true
    }
  }
}
