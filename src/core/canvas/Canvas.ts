import { Pause, Resume, Update, UserInput, Render } from '../signals';
import Vector2 from '../variant_types/Vector2';
import Camera from './Camera';
import Renderer from './Renderer';

/**
 * 画布
 */
export default class Canvas {
  readonly canvasElement: HTMLCanvasElement;
  readonly renderer: Renderer;
  readonly camera: Camera;
  public resolution: Vector2 = { x: 1920, y: 1080 };
  public viewSize: Vector2 = { x: 0, y: 0 };
  public animationInterval: number = 16;
  public isTestMode: boolean = false;

  public get ratio(): number {
    return this.resolution.x / this.resolution.y;
  }

  public get scale(): number {
    return this.viewSize.y / this.resolution.y;
  }

  // signals
  public readonly update: Update = new Update();
  public readonly render: Render = new Render();
  public readonly userInput: UserInput = new UserInput();
  public readonly pause: Pause = new Pause();
  public readonly resume: Resume = new Resume();

  constructor(elementId: string, resolution: Vector2) {
    this.canvasElement = document.getElementById(elementId) as HTMLCanvasElement;
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.resolution = resolution

    window.onresize = window.onload = () => {
      this.resize();
    };

    this.resize();
  }

  protected resize() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    if (width / height > this.ratio) {
      this.viewSize.x = this.ratio * height;
      this.viewSize.y = height;
    } else {
      this.viewSize.x = width;
      this.viewSize.y = width / this.ratio;
    }
    this.canvasElement.setAttribute('width', this.viewSize.x.toString());
    this.canvasElement.setAttribute('height', this.viewSize.y.toString());
  }
}
