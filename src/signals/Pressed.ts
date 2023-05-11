import Sprite from "../sprites/Sprite";
import Signal from "../variant_types/Signal";
import Vector2 from "../variant_types/Vector2";

class Pressed extends Signal {
  sprite: Sprite

  constructor(sprite: Sprite) {
    super()
    this.sprite = sprite
  }

  emit(mouse_event: MouseEvent): void {
    let point: Vector2 = { x: mouse_event.clientX, y: mouse_event.clientY }
    if (this.sprite.has_point(point)) {
      for (let fn of this.fns) {
        fn(mouse_event)
      }
    }
  }
}

export default Pressed