/**
 * 资源系统，用于操作图像音频等资源
 */
export default function asset() {
  // 图片路径
  let publicPath = "";

  // promise集合
  let loadings = [];
  
  // 资源集合
  let assets = {};

  return {
    /**
     * 判断资源是否加载完成，
     * new Stage()时会自动调用该函数
     * @param {Function} callback 回调函数
     */
    onReady(callback) {
      if (loadings.length > 0) {
        Promise.all(loadings).then(callback);
      } else {
        callback();
      }
    },
    /**
     * 获取资源
     * @param {string} group 资源分组
     * @param {string} name 资源名
     */
    get(group, name) {
      return assets[group][name];
    },
    /**
     * 载入资源
     * @param {Object} options 
     */
    load(options) {
      const type = options.type;
      const group = options.group;
      const name = options.name;
      const url = options.url;

      if (!assets[group]) assets[group] = {};
      if (assets[group][name]) return;

      if (type === 'image') {
        let image = new Image();
        loadings.push(new Promise(function (resolve) {
          image.onload = function () {
            assets[group][name] = image;
            resolve(true);
          }
        }))
        image.src = publicPath + url;
        return;
      }

      if (type === 'animation') {
        let image = new Image();
        loadings.push(new Promise(function (resolve) {
          image.onload = function () {
            assets[group][name] = {
              image,
              frame: options.frame,
              interval: options.interval,
              flip: options.flip
            };
            resolve(true);
          }
        }));
        image.src = publicPath + url;
        return;
      }

      if (type === 'audio') {
        assets[group][name] = new Audio(publicPath + url);
      }
    },
    /**
     * 设置路径
     * @param {string} path 
     */
    setPath(path) {
      if (!path) return;
      publicPath = path;
    }
  }
}