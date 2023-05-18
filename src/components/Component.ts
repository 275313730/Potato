import { Sprite } from "../sprites";

export default abstract class Component {
  protected sprite: Sprite

  /**
   * 注册组件
   * @param sprite 精灵单位
   */
  public register(sprite: Sprite) {
    this.sprite = sprite
  }

  /**
   * 注销组件
   */
  public unregister() {
    this.sprite = null
  }

  /**
   * 更新组件
   */
  public abstract update(...args: any): void
}