import UserInputEvent from './UserInputEvent';

/**
 * 键盘输入事件
 */
export default interface KeyboardInputEvent extends UserInputEvent {
  readonly altKey: boolean;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly isComposing: boolean;
  readonly key: string;
  readonly location: number;
  readonly metaKey: boolean;
  readonly repeat: boolean;
  readonly shiftKey: boolean;
  readonly status: string;
}
