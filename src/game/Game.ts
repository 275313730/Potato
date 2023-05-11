import Canvas from "../canvas/Canvas"

class Game {
  static canvas: Canvas

  static init() {
    this.initStyle()
    this.canvas = new Canvas("potato")
  }

  static initStyle(): void {
    let body = document.body;
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.width = "100vw";
    body.style.height = "100vh";
    body.style.overflow = "hidden";
    body.style.display = "flex";
    body.style.alignItems = "center";
    body.style.justifyContent = "center";
  }

  static isMobile(): boolean {
    const inBrowser = typeof window !== "undefined";
    const UA = inBrowser && window.navigator.userAgent.toLowerCase();
    const isAndroid = (UA && UA.indexOf("android") > 0);
    const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
    if (isAndroid || isIOS) {
      return true;
    } else {
      return false;
    }
  }
}

export default Game