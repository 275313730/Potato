import { LocateMode } from '../enums';
import { Sprite, SubViewSprite } from '../sprites';
import { Color, Font, Rect, TextureRect, Transform, Vector2 } from '../variant_types';
import Camera from './Camera';
import Canvas from './Canvas';

export default class Renderer {
  public readonly ctx: CanvasRenderingContext2D;
  protected readonly canvas: Canvas;
  protected readonly camera: Camera;
  public readonly backgroundColor: Color = { r: 15, g: 15, b: 15, a: 1 };

  public get scale() {
    return this.canvas.scale;
  }

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.ctx = canvas.canvasElement.getContext('2d') as CanvasRenderingContext2D;
    this.camera = canvas.camera;
  }

  public clear(viewSize: Vector2) {
    this.ctx.clearRect(0, 0, viewSize.x, viewSize.y);
  }

  public getFinalRect(transform: Transform): Rect {
    switch (transform.locateMode) {
      case LocateMode.ABSOLUTE:
        return {
          x: transform.position.x * this.canvas.scale,
          y: transform.position.y * this.canvas.scale,
          width: transform.size.x * transform.scale.x * this.scale,
          height: transform.size.y * transform.scale.y * this.scale,
        };
      case LocateMode.REALATIVE:
        return {
          x: (transform.position.x - this.camera.position.x) * this.scale,
          y: (transform.position.y - this.camera.position.y) * this.scale,
          width: transform.size.x * transform.scale.x * this.scale,
          height: transform.size.y * transform.scale.y * this.scale,
        };
      default:
        return {
          x: (transform.position.x - this.camera.position.x) * this.scale,
          y: (transform.position.y - this.camera.position.y) * this.scale,
          width: transform.size.x * transform.scale.x * this.scale,
          height: transform.size.y * transform.scale.y * this.scale,
        };
    }
  }

  public drawRect(sprite: Sprite, color: Color) {
    const finalRect = this.getFinalRect(sprite);
    this.ctx.fillStyle = this.rgba2hex(color);
    this.ctx.fillRect(finalRect.x, finalRect.y, finalRect.width, finalRect.height);
  }

  public drawTexture(transform: Transform, textureRect: TextureRect, drawFn: (rect: Rect) => void) {
    const finalRect = this.getFinalRect(transform);
    const scale: Vector2 = { x: 1, y: 1 };
    const trans: Vector2 = { x: 0, y: 0 };
    if (textureRect.flipH) {
      trans.x = finalRect.width + finalRect.x * 2;
      scale.x = -1;
    }
    if (textureRect.flipV) {
      trans.y = finalRect.height + finalRect.y * 2;
      scale.y = -1;
    }
    if (textureRect.flipH || textureRect.flipV) {
      this.ctx.translate(trans.x, trans.y);
      this.ctx.scale(scale.x, scale.y);
    }
    drawFn(finalRect);
    if (textureRect.flipH || textureRect.flipV) {
      this.ctx.translate(trans.x, trans.y);
      this.ctx.scale(scale.x, scale.y);
    }
  }

  public drawLabel(transform: Transform, font: Font, content: string) {
    const finalRect = this.getFinalRect(transform);
    const finalFontSize = ((font.fontSize * font.fontSize) / 14) * this.scale;

    this.ctx.font = `${font.fontStyle} ${font.fontWeight} ${finalFontSize}px ${font.fontType}`;
    this.ctx.fillStyle = this.rgba2hex(font.fontColor);

    if (transform.size.x > 0) {
      let line = 1;
      let lineWidth = 0;
      let lineContent = '';
      for (const char of content) {
        const charWidth = this.ctx.measureText(char);
        if (lineWidth + charWidth.width <= finalRect.width) {
          lineWidth += charWidth.width;
          lineContent += char;
        } else {
          this.ctx.fillText(lineContent, finalRect.x, finalRect.y + font.lineHeight * line);
          line += 1;
          lineWidth = charWidth.width;
          lineContent = char;
        }
      }
      if (lineWidth > 0) {
        this.ctx.fillText(lineContent, finalRect.x, finalRect.y + font.lineHeight * line);
      }
    } else {
      this.ctx.fillText(content, finalRect.x, finalRect.y);
    }
  }

  public drawImage(transform: Transform, textureRect: TextureRect) {
    this.drawTexture(transform, textureRect, (finalRect: Rect) => {
      this.ctx.drawImage(textureRect.texture, finalRect.x, finalRect.y, finalRect.width, finalRect.height);
    });
  }

  public drawClipImage(transform: Transform, textureRect: TextureRect, clipRect: Rect) {
    this.drawTexture(transform, textureRect, (finalRect: Rect) => {
      this.ctx.drawImage(
        textureRect.texture,
        clipRect.x,
        clipRect.y,
        clipRect.width,
        clipRect.height,
        finalRect.x,
        finalRect.y,
        finalRect.width,
        finalRect.height,
      );
    });
  }

  public drawSubView(sprite: SubViewSprite) {
    const finalRect = this.getFinalRect(sprite.transform);
    this.ctx.drawImage(sprite.canvasElement, finalRect.x, finalRect.y);
  }

  public rgba2hex(color: Color) {
    let hex =
      '#' +
      (color.r | (1 << 8)).toString(16).slice(1) +
      (color.g | (1 << 8)).toString(16).slice(1) +
      (color.b | (1 << 8)).toString(16).slice(1);

    const alpha = ((color.a * 255) | (1 << 8)).toString(16).slice(1);
    hex = hex + alpha;
    return hex;
  }
}
