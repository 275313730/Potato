import { Sprite } from "../sprites";

export default abstract class Component {
  protected sprite: Sprite

  public register(sprite: Sprite) {
    this.sprite = sprite
  }

  public unregister() {
    this.sprite = null
  }

  public abstract update(): void
}