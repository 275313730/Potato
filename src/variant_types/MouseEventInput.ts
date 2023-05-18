import UserInputEvent from "./UserInputEvent";
import Vector2 from "./Vector2";

export default interface MouseButtonEvent extends UserInputEvent {
  readonly position: Vector2;
  readonly altKey: boolean;
  readonly button: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly status: string;
}