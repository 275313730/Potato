"use strict"
import Transfrom from "../components/Transfrom.js";
import Vector2 from "../variant_types/Vector2.js";
import Pressed from "../signals/Pressed.js";
import Appearance from "../components/Appearance.js";
import SpriteSystem from "../systems/SpriteSystem.js";
import Game from "../game/Game.js";

/**
 * 精灵构造函数
 * @param {Object} options
 */
class Sprite {
  readonly id: number = SpriteSystem.generateId()

  pressed: Pressed = new Pressed(this)

  transform: Transfrom = new Transfrom()
  appearance: Appearance = new Appearance()

  constructor() {
    this._ready()
  }

  onReady() {
    //do somethin
  }

  onUpdate() {
    // do something
  }

  onDestroy() {
    // do somethin
  }

  protected _ready() {
    Game.update.connect(this._update)
  }

  protected _input(event: Event): void {
    if (event instanceof MouseEvent) {
      this.pressed.emit(event)
    }
  }

  protected _update(): void {
    if (this.appearance.visible) this._render()
    this.onUpdate()
  }

  protected _render(): void {

  }

  protected _destroy() {
    Game.update.disconnect(this._update)
  }

  has_point(point: Vector2): boolean {
    return true
  }
}

export default Sprite