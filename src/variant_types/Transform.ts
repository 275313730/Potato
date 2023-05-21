import Vector2 from './Vector2';
import LocateMode from '../enums/LocateMode';

/**
 * 精灵外观
 */
export default interface Transform {
  size: Vector2;
  position: Vector2;
  rotation: number;
  scale: Vector2;
  locateMode: LocateMode;
}
