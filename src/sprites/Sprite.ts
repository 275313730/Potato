import Game from "../game/Game"
import { Pressed, MouseIn, MouseOut } from "../signals"
import { MouseFilter, EventType, LocateMode } from "../enums";
import { Appearance, Transform, UserInputEvent, MouseEventInput, Vector2 } from "../variant_types"
import Component from "../components/Component"

/**
 * 精灵构造函数
 * @param {Object} options
 */
export default class Sprite {
  readonly id: number = Game.generateId()

  public parent: Sprite
  public children: Sprite[] = []
  protected components: Component[] = []

  public transform: Transform = {
    position: { x: 0, y: 0 },
    size: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    rotation: 0,
    locateMode: LocateMode.REALATIVE
  }

  public get size() {
    return this.transform.size
  }

  public set size(value: Vector2) {
    this.transform.size = value
  }

  public get position() {
    return this.transform.position
  }

  public set position(value: Vector2) {
    this.transform.position = value
  }

  public get rotation() {
    return this.transform.rotation
  }

  public set rotation(value: number) {
    this.transform.rotation = value
  }

  public get scale() {
    return this.transform.scale
  }

  public set scale(value: Vector2) {
    this.transform.scale = value
  }

  public get locateMode() {
    return this.transform.locateMode
  }

  public set locateMode(value: number) {
    this.transform.locateMode = value
  }

  public appearance: Appearance = {
    visible: true,
    modulate: { r: 255, g: 255, b: 255, a: 1 },
  }

  public get visible() {
    return this.appearance.visible
  }

  public set visible(value: boolean) {
    this.appearance.visible = value
  }

  public mouseFilter: MouseFilter = MouseFilter.STOP

  public paused: boolean = false

  // 信号
  public readonly pressed: Pressed = new Pressed()
  public readonly mouseIn: MouseIn = new MouseIn()
  public readonly mouseOut: MouseOut = new MouseOut()

  // 鼠标状态
  protected mouseStatus: string = "mouseup"
  protected isMouseIn: boolean = false

  constructor() {
    setTimeout(() => {
      this._ready()
    }, 0);
  }

  protected _ready(): void {
    Game.canvas.update.connect(this.id, this._update.bind(this))
    Game.canvas.userInput.connect(this.id, this._input.bind(this))
    Game.canvas.pause.connect(this.id, this._pause.bind(this))
    Game.canvas.resume.connect(this.id, this._resume.bind(this))
    this.onReady()
  }

  protected _input(event: UserInputEvent): void {
    if (event.type === EventType.MOUSE_BUTTON) {
      const mouseButton = event as MouseEventInput
      if (mouseButton.status == "mousedown" && this.isMouseIn) this.mouseStatus = mouseButton.status
      if (mouseButton.status == "mouseup") {
        if (this.mouseStatus === "mousedown" && this.isMouseIn) this.pressed.emit()
        this.mouseStatus = mouseButton.status
      }
    } else if (event.type === EventType.MOUSE_MOTION) {
      const mouseMotion = event as MouseEventInput
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
    this.beforeUpdate()
    if (this.visible) this._render(delta)
    for (let component of this.components) {
      component.update()
    }
    this.onUpdate(delta)
  }

  protected _pause() {
    this.paused = true
  }

  protected _resume() {
    this.paused = false
  }

  protected _render(delta: number): void { }

  public _destroy(): void {
    this.beforeDestroy()
    for (let component of this.components) {
      component.unregister()
    }
    Game.canvas.update.disconnect(this.id)
    Game.canvas.userInput.disconnect(this.id)
    Game.canvas.pause.disconnect(this.id)
    Game.canvas.resume.disconnect(this.id)
    this.onDestroy()
  }

  public onReady(): void { }

  public beforeUpdate(): void { }

  public onUpdate(delta: number): void { }

  public onInput(event: UserInputEvent): void { }

  public beforeDestroy(): void { }

  public onDestroy(): void { }

  public addChild(sprite: Sprite) {
    sprite.parent = this
    this.children.push(sprite)
  }

  public removeChild(sprite: Sprite) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child === sprite) {
        this.children.splice(i, 1)
        break
      }
    }
  }

  protected registerComponent(component: Component) {
    component.register(this)
    this.components.push(component)
  }

  protected unregisterComponent(targetComponent: Component) {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      if (component === targetComponent) {
        this.components.splice(i, 1)
        return
      }
    }
  }

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
