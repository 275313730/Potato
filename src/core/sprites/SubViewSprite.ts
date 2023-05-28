import Game from '../game';
import Sprite from './Sprite';

export default class SubViewSprite extends Sprite {
  public readonly canvasElement: HTMLCanvasElement = document.createElement('canvas');
  protected rendering: CanvasRenderingContext2D = this.canvasElement.getContext('2d') as CanvasRenderingContext2D;

  protected _render(delta: number): void {
    Game.renderer.drawSubView(this);
  }
}
