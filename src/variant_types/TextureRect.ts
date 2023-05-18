import { ExpandMode } from "../enums";

/**
 * 纹理
 */
export default interface TextureRect {
  /**
   * 图片节点
   */
  texture: HTMLImageElement;
  /**
   * 尺寸模式
   */
  expandMode: ExpandMode;
  /**
   * 水平翻转
   */
  flipH: boolean;
  /**
   * 垂直翻转
   */
  flipV: boolean;
}
