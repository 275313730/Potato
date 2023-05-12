import ExpandMode from "../enums/ExpandMode";

interface TextureRect {
  /**
   * 图片节点
   */
  texture: HTMLImageElement;
  /**
   * 图片模式
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

export default TextureRect