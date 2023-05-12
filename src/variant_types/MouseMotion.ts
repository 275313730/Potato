import UserInputEvent from "./UserInputEvent";
import Vector2 from "./Vector2";

export default interface MouseMotion extends UserInputEvent {
  readonly position: Vector2;
}