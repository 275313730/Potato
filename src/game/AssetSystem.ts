/**
 * 资源系统，用于操作图像音频等资源
 */
export default class AssetSystem {
  // 图片路径
  protected static publicPath: string = "./assets/";

  static loadImage(path: string): HTMLImageElement {
    let image = new Image();
    image.src = this.publicPath + path;
    return image
  }

  static loadAudio(path: string): HTMLAudioElement {
    const audio = new Audio();
    audio.src = this.publicPath + path
    return audio
  }

  /**
   * 设置路径
   * @param {string} path 
   */
  static setPath(path: any) {
    if (!path) return;
    this.publicPath = path;
  }
}
