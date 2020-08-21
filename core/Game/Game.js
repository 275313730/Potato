"use strict"
import asset from "./Asset.js";
import { listenInputEvent, autoResizeCanvas, isMobile, initStyle } from './Utils.js'
import event from "../Common/Event.js";

const Game = {};

// 初始化游戏
Game.init = function (options) {
  initStyle();
  // 画布
  this.canvas = document.createElement('canvas');
  document.body.appendChild(this.canvas);

  // 画布上下文
  this.context = this.canvas.getContext("2d");

  // 初始化宽度和高度
  let bodyWidth = document.body.clientWidth;
  let bodyHeight = document.body.clientHeight;
  let defaultRatio = bodyWidth / bodyHeight;
  if (options.width && options.height) {
    this.ratio = options.width / options.height;
  } else {
    this.ratio = bodyWidth / bodyHeight;
  }
  if (this.ratio > defaultRatio) {
    this.width = bodyWidth;
    this.height = bodyWidth / this.ratio;
  } else {
    this.height = bodyHeight;
    this.width = bodyHeight * this.ratio;
  }

  // 设置canvas宽高
  this.canvas.setAttribute("width", this.width + "px");
  this.canvas.setAttribute("height", this.height + "px");

  // canvas黑色背景
  this.canvas.style.backgroundColor = "black";

  // 缩放
  this.scale = this.canvas.clientHeight / this.height;

  // 键盘状态
  this.key = null;

  // 用户事件
  this.inputEvents = {};

  // 动画间隔帧(每隔n帧绘制下一个关键帧)
  this.animationInterval = options.animationInterval || 16;

  // 测试模式
  this.test = options.test || false;

  // 是否移动端
  this.isMobile = isMobile();

  // 资源路径
  this.asset.setPath(options.publicPath);

  autoResizeCanvas(this);
  listenInputEvent(this);

  // 禁用右键菜单
  if (!this.test) {
    window.oncontextmenu = function () {
      return false;
    }
  }
}

Game.mix = function (Class, func) {
  if (!Class["mixins"]) {
    Class["mixins"] = [];
  }
  Class["mixins"].push(func);
}

Game.asset = asset(Game);

Game.event = event(Game);

Game.stage = null;

export default Game