import Vector2 from "./Vector2"

class Transform {
  size: Vector2 = { x: 0, y: 0 }
  position: Vector2 = { x: 0, y: 0 }
  rotation: number = 0
  scale: Vector2 = { x: 1, y: 1 }
  flip: boolean = false
}

export default Transform