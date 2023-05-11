import Vector2 from "./Vector2"

interface Transfrom {
  size: Vector2;
  position: Vector2;
  rotation: number;
  scale: Vector2;
  flip: boolean;
}

export default Transfrom