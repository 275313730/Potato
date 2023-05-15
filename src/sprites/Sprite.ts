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
import MouseMotionEvent from "../variant_types/MouseMotionEvent"
import MouseButtonEvent from "../variant_types/MouseButtonEvent"
import EventType from "../enums/EventType"
import LocateMode from "../enums/LocateMode"
import Component from "../components/Component"
import Camera from "../canvas/Camera"
import Canvas from "../canvas/Canvas"

/**
 * 精灵构造函数
 * @param {Object} options
 */
export default class Sprite implements Transform, Appearance {
  readonly id: number = SpriteSystem.generateId()

  public canvas: Canvas
  public camera: Camera

  public parent: Sprite
  public children: Sprite[] = []
  protected components: Component[] = []

  public position: Vector2 = { x: 0, y: 0 }
  public size: Vector2 = { x: 0, y: 0 }
  public rotation: number = 0
  public scale: Vector2 = { x: 0, y: 0 }
  public locateMode: LocateMode = LocateMode.REALATIVE
  public visible: boolean = true
  public modulate: Color = { r: 255, g: 255, b: 255, a: 1 }
  public mouseFilter: MouseFilter = MouseFilter.STOP

  // 信号
  public readonly pressed: Pressed = new Pressed()
  public readonly mouseIn: MouseIn = new MouseIn()
  public readonly mouseOut: MouseOut = new MouseOut()

  public readonly updateFn: Function = this.update.bind(this)
  public readonly inputFn: Function = this.input.bind(this)

  // 鼠标状态
  protected mouseStatus: string = "mouseup"
  protected isMouseIn: boolean = false

  public ready(): void {
    this.onReady()
  }

  protected input(event: UserInputEvent): void {
    if (event.type === EventType.MOUSE_BUTTON) {
      const mouseButton = event as MouseButtonEvent
      if (mouseButton.status == "mousedown" && this.isMouseIn) this.mouseStatus = mouseButton.status
      if (mouseButton.status == "mouseup") {
        if (this.mouseStatus === "mousedown" && this.isMouseIn) this.pressed.emit()
        this.mouseStatus = mouseButton.status
      }
    } else if (event.type === EventType.MOUSE_MOTION) {
      const mouseMotion = event as MouseMotionEvent
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

  protected update(delta: number): void {
    this.beforeUpdate()
    if (this.visible) this.render()
    for (let component of this.components) {
      component.update()
    }
    this.onUpdate(delta)
  }

  protected render(): void { }

  public destroy(): void {
    this.beforeDestroy()
    for (let component of this.components) {
      component.unregister()
    }
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
        if (point.x + this.camera.position.x < this.position.x) return false
        if (point.x + this.camera.position.x > this.position.x + this.size.x * this.scale.x) return false
        if (point.y + this.camera.position.y < this.position.y) return false
        if (point.y + this.camera.position.y > this.position.y + this.size.y * this.scale.y) return false
        return true
    }
  }
}
