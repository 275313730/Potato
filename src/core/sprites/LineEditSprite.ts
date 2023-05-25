import Game from '../game';
import Color from '../variant_types/Color';
import Sprite from './Sprite';

export default class LineEditSprite extends Sprite {
  protected textarea: HTMLTextAreaElement = document.createElement('textarea');

  public outlineColor: Color = { r: 100, g: 100, b: 100, a: 1 };

  public set textColor(value: Color) {
    this.textarea.style.color = Game.render.rgba2hex(value);
  }

  public set backgroundColor(value: Color) {
    this.textarea.style.backgroundColor = Game.render.rgba2hex(value);
  }

  protected _ready(): void {
    super._ready();
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'style_' + this.id;
    document.body.appendChild(this.textarea);
    this.textarea.style.display = 'none';
    this.textarea.style.color = Game.render.rgba2hex({ r: 255, g: 255, b: 255, a: 1 });
    this.textarea.style.backgroundColor = Game.render.rgba2hex({ r: 50, g: 50, b: 50, a: 1 });
    this.textarea.style.position = 'absolute';
    this.textarea.style.resize = 'none';
    addNewStyle(
      `.style_${this.id}::selection {background:${Game.render.rgba2hex({ r: 100, g: 100, b: 100, a: 1 })};} `,
    );
  }

  protected _render(delta: number): void {
    this.textarea.style.display = 'block';
    const finalRect = Game.render.getFinalRect(this.transform);
    this.textarea.style.left = Game.canvasElement.offsetLeft + finalRect.x + 'px';
    this.textarea.style.top = Game.canvasElement.offsetTop + finalRect.y + 'px';
    this.textarea.style.width = finalRect.width + 'px';
    this.textarea.style.height = finalRect.height + 'px';
  }
}

function addNewStyle(newStyle: string) {
  const styleElement = document.createElement('style');
  styleElement.id = 'styles_potato';
  document.head.appendChild(styleElement);
  styleElement.appendChild(document.createTextNode(newStyle));
}
