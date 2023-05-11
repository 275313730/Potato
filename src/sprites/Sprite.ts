import Appearance from "../components/Appearance"
import Transfrom from "../components/Transfrom"
import Game from "../game/Game"
import Pressed from "../signals/Pressed"
import SpriteSystem from "../systems/SpriteSystem"
import Color from "../variant_types/Color"
import Vector2 from "../variant_types/Vector2"

/**
 * 精灵构造函数
 * @param {Object} options
 */
class Sprite {
  readonly id: number = SpriteSystem.generateId()

  pressed: Pressed = new Pressed(this)

  public set position(value: Vector2) {
    this.transform.position = value
  }

  public get position() {
    return this.transform.position
  }

  public set size(value: Vector2) {
    this.transform.position = value
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

  protected updateFn: Function = this._update.bind(this)

  constructor() {
    this._ready()
  }

  protected _ready() {
    Game.update.connect(this.updateFn)
  }

  protected _input(event: Event): void {
    if (event instanceof MouseEvent) {
      this.pressed.emit(event)
    }
  }

  protected _update(delta: number): void {
    if (this.appearance.visible) this._render()
    this.onUpdate(delta)
  }

  protected _render(): void {

  }

  protected _destroy() {
    Game.update.disconnect(this._update.bind(this))
  }

  public onReady() {
    //do somethin
  }

  public onUpdate(delta: number) {
    // do something
  }

  public onDestroy() {
    // do somethin
  }

  public has_point(point: Vector2): boolean {
    return true
  }
}

export default Sprite