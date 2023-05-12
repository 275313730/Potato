import MouseMotion from "./MouseMotion";

export default interface MouseButton extends MouseMotion {
  readonly altKey: boolean;
  readonly button: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly status: string;
}