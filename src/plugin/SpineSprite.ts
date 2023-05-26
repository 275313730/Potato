import Game from "../core/game";
import Sprite from "../core/sprites/Sprite";
import spine from "../lib/spine-ts/spine-webgl";

interface AnimationData {
  animationName: string;
  times: number;
  speed: number;
}

export default class SpineSprite extends Sprite {
  protected spineName: string
  protected playing: boolean = false
  protected speed: number = 1
  protected animationQueue: AnimationData[] = []

  protected canvas2D: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected canvas3D: HTMLCanvasElement
  protected mangedGl: spine.webgl.ManagedWebGLRenderingContext

  protected shader: spine.webgl.Shader
  protected batcher: spine.webgl.PolygonBatcher
  protected mvp: spine.webgl.Matrix4
  protected skeletonRenderer: spine.webgl.SkeletonRenderer
  protected assetManager: spine.webgl.AssetManager
  protected shapes: spine.webgl.ShapeRenderer

  protected skeleton: spine.Skeleton | undefined
  protected state: spine.AnimationState | undefined;
  protected premultipliedAlpha: boolean;
  protected loadStatus = false;

  constructor(spineName: string, premultipliedAlpha: boolean = false) {
    super()
    this.spineName = spineName
    this.premultipliedAlpha = premultipliedAlpha

    this.canvas2D = document.createElement("canvas")
    this.canvas2D.width = Game.canvas.resolution.x
    this.canvas2D.height = Game.canvas.resolution.y

    this.ctx = this.canvas2D.getContext("2d") as CanvasRenderingContext2D
    this.canvas3D = document.createElement("canvas")
    this.canvas3D.width = Game.canvas.resolution.x
    this.canvas3D.height = Game.canvas.resolution.y

    this.mangedGl = new spine.webgl.ManagedWebGLRenderingContext(this.canvas3D, { premultipliedAlpha: false })

    this.shader = spine.webgl.Shader.newTwoColoredTextured(this.mangedGl);
    this.batcher = new spine.webgl.PolygonBatcher(this.mangedGl);
    this.mvp = new spine.webgl.Matrix4();
    this.mvp.ortho2d(0, 0, this.canvas3D.width - 1, this.canvas3D.height - 1);
    this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.mangedGl);
    this.assetManager = new spine.webgl.AssetManager(this.mangedGl);

    this.shapes = new spine.webgl.ShapeRenderer(this.mangedGl);

    this.assetManager.loadBinary("assets/" + spineName + ".skel");
    this.assetManager.loadTextureAtlas("assets/" + spineName + ".atlas");
  }

  protected _update(delta: number): void {
    super._update(delta)
    if (this.skeleton) return
    if (this.assetManager.isLoadingComplete() === false) return
    this.loadSkeleton();
    this.onLoad()
  }

  protected loadSkeleton(skin: string | undefined = undefined) {
    if (skin === undefined) skin = "default";

    const atlas = this.assetManager.get("assets/" + this.spineName.replace("-ess", "").replace("-pro", "") + (this.premultipliedAlpha ? "-pma" : "") + ".atlas");
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
    const skeletonBinary = new spine.SkeletonBinary(atlasLoader);

    skeletonBinary.scale = 1;
    const skeletonData = skeletonBinary.readSkeletonData(this.assetManager.get("assets/" + this.spineName + ".skel"));
    this.skeleton = new spine.Skeleton(skeletonData);
    this.skeleton.setSkinByName(skin);

    this.skeleton.scaleX = 1
    this.skeleton.scaleY = -1
    this.skeleton.x = this.skeleton.data.width
    this.skeleton.y = this.skeleton.data.height

    const animationStateData = new spine.AnimationStateData(this.skeleton.data);
    this.state = new spine.AnimationState(animationStateData);

    this.state.addListener({
      start: (track: spine.TrackEntry) => { this.onAnimStart() },
      interrupt: (track: spine.TrackEntry) => { this.onAnimInterrupt() },
      end: (track: spine.TrackEntry) => { this.onAnimEnd() },
      dispose: (track: spine.TrackEntry) => { },
      complete: (track: spine.TrackEntry) => {
        this.playNextAnimation()
        this.onAnimComplete()
      },
      event: (track: spine.TrackEntry, event: spine.Event) => { this.onAnimEvent(event) }
    })

    this.playNextAnimation()
  }

  protected _render(delta: number): void {
    // Apply the animation state based on the delta time.
    if (this.state === undefined || this.skeleton === undefined) return
    if (this.playing === false && this.animationQueue.length > 0) this.playNextAnimation()
    // 防抖
    delta = 1 / 120 * this.speed

    this.mangedGl.gl.clearColor(1, 1, 1, 0);
    this.mangedGl.gl.clear(this.mangedGl.gl.COLOR_BUFFER_BIT);

    this.canvas3D.width = Game.canvas.viewSize.x
    this.canvas3D.height = Game.canvas.viewSize.y

    this.skeleton.scaleX = this.scale.x * Game.canvas.scale
    this.skeleton.scaleY = -this.scale.y * Game.canvas.scale
    this.skeleton.x = this.position.x + this.skeleton.data.width * this.skeleton.scaleX
    this.skeleton.y = this.position.y + this.skeleton.data.height * -this.skeleton.scaleY

    this.state.update(delta);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

    this.shader.bind();
    this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    this.batcher.begin(this.shader);
    this.skeletonRenderer.premultipliedAlpha = this.premultipliedAlpha;
    this.skeletonRenderer.draw(this.batcher, this.skeleton);
    this.batcher.end();

    this.shader.unbind();

    const { drawingBufferWidth, drawingBufferHeight, RGBA, UNSIGNED_BYTE } = this.mangedGl.gl
    const pixels = new Uint8ClampedArray(drawingBufferWidth * drawingBufferHeight * 4);
    this.mangedGl.gl.readPixels(0, 0, drawingBufferWidth, drawingBufferHeight, RGBA, UNSIGNED_BYTE, pixels);
    const imageData = new ImageData(drawingBufferWidth, drawingBufferHeight)
    imageData.data.set(pixels);

    this.ctx.putImageData(imageData, 0, 0)
    Game.render.ctx.drawImage(this.canvas2D, 0, 0);
  }

  protected playNextAnimation() {
    if (this.animationQueue.length > 0 && this.state) {
      const nextData = this.animationQueue[0]
      this.speed = nextData.speed
      this.playing = true
      if (nextData.times === -1) {
        this.state.setAnimation(0, nextData.animationName, true)
        this.animationQueue.shift()
      } else if (nextData.times > 0) {
        nextData.times -= 1
        this.state.setAnimation(0, nextData.animationName, false)
        if (nextData.times === 0) {
          this.animationQueue.shift()
        }
      }
    } else {
      this.playing = false
    }
  }

  protected onLoad() { }

  protected onAnimStart() { }

  protected onAnimInterrupt() { }

  protected onAnimEnd() { }

  protected onAnimComplete() { }

  protected onAnimEvent(event: spine.Event) { }


  public addAnimation(options: AnimationData) {
    this.animationQueue.push({
      animationName: options.animationName,
      times: options.times,
      speed: options.speed,
    })
  }
}
