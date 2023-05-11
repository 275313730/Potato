import Vector2 from "../variant_types/Vector2"

class Transfrom {
  size: Vector2 = { x: 0, y: 0 }
  realSize: Vector2 = { x: 0, y: 0 }
  position: Vector2 = { x: 0, y: 0 }
  rotation: number = 0
  scale: Vector2 = { x: 1, y: 1 }
  flip: boolean = false

  constructor(options?: { size?: Vector2, position?: Vector2, rotation?: number, scale?: Vector2, flip?: boolean }) {
    this.size = options?.size
    this.position = options?.position
    this.rotation = options?.rotation
    this.scale = options?.scale
    this.flip = options?.flip
  }
}

export default Transfrom