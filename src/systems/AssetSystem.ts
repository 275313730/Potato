/**
 * 资源系统，用于操作图像音频等资源
 */

let assets: any = {}

// promise集合
let loadings: Promise<boolean>[] = [];

/**
 * 判断资源是否加载完成，
 * new Stage()时会自动调用该函数
 * @param {Function} callback 回调函数
 */
function AssetReady(fn: Function) {
  Promise.all(this.loadings).then(res => fn())
}

function assetExist(group: string, name: string): boolean {
  if (!assets[group]) return false
  if (!assets[group][name]) return false
  return true
}

class AssetSystem {
  // 图片路径
  static publicPath: string = "./assets/";

  /**
   * 获取资源
   * @param {string} group 资源分组
   * @param {string} name 资源名
   */
  static getAsset(group: string, name: string): any {
    return assets[group][name];
  }

  /**
   * 载入资源
   * @param {Object} options 
   */
  static loadAnimation(options: { type: string, group: string, name: string, path: string, frame?: number, interval?: number, flip?: boolean }): void {
    if (assetExist(options.group, options.name)) return;
    if (!assets[options.group]) assets[options.group] = {};

    let image = new Image();
    loadings.push(new Promise((resolve) => {
      image.onload = () => {
        assets[options.group][options.name] = {
          image,
          frame: options.frame,
          interval: options.interval,
          flip: options.flip
        };
        resolve(true);
      }
    }));
    image.src = this.publicPath + options.path;
  }

  static loadImage(options: { group: string, name: string, path: string }) {
    if (assetExist(options.group, options.name)) return;
    if (!assets[options.group]) assets[options.group] = {};

    let image = new Image();
    loadings.push(new Promise((resolve) => {
      image.onload = () => {
        assets[options.group][options.name] = image;
        resolve(true);
      }
    }))
    image.src = this.publicPath + options.path;
  }

  static loadAudio(options: { group: string, name: string, path: string }): void {
    if (assetExist(options.group, options.name)) return;
    if (!assets[options.group]) assets[options.group] = {};
    assets[options.group][options.name] = new Audio(this.publicPath + options.path);
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

export default AssetSystem
export { AssetReady }