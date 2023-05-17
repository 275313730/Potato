import MouseMotionEvent from "./MouseMotionEvent";

export default interface MouseButtonEvent extends MouseMotionEvent {
  readonly altKey: boolean;
  readonly button: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly status: string;
}