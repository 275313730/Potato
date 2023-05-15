import UserInputEvent from "./UserInputEvent";
import Vector2 from "./Vector2";

/**
 * 鼠标移动事件
 */
export default interface MouseMotionEvent extends UserInputEvent {
  readonly position: Vector2;
}