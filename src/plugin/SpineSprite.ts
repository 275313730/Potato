import Game from "../core/game";
import Sprite from "../core/sprites/Sprite";
import spine from "../lib/spine-ts/spine-webgl";

interface AnimationData {
  animationName: string;
  times: number;
  speed: number;
  delay: number;
}

export default class SpineSprite extends Sprite {
  protected static offscreenCanvas2D: OffscreenCanvas
  protected static offscreenCtx2D: OffscreenCanvasRenderingContext2D

  protected static offscreenCanvas3D: OffscreenCanvas
  protected static offscreenWebgl: WebGLRenderingContext

  protected static mangedGl: spine.webgl.ManagedWebGLRenderingContext

  protected spineName: string
  protected playingQueue: boolean = false
  protected currentAnimation: AnimationData | undefined
  protected speed: number = 1
  protected animationQueue: AnimationData[] = []
  protected animationCount: number = 0

  protected currentDelay: number = 0

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

  public static generate() {
    this.offscreenCanvas2D = new OffscreenCanvas(Game.resolution.x, Game.resolution.y)
    this.offscreenCtx2D = this.offscreenCanvas2D.getContext("2d") as OffscreenCanvasRenderingContext2D
    this.offscreenCanvas3D = new OffscreenCanvas(Game.resolution.x, Game.resolution.y)
    this.offscreenWebgl = this.offscreenCanvas3D.getContext("webgl") as WebGLRenderingContext
    this.offscreenWebgl.clearColor(1, 1, 1, 0)
    this.mangedGl = new spine.webgl.ManagedWebGLRenderingContext(SpineSprite.offscreenWebgl, { premultipliedAlpha: false })
    Game.canvas.update.connect(-300, (delta: number) => this.clear())
    Game.canvas.render.connect(-300, (delta: number) => this.webglToContext())
  }

  protected static clear() {
    this.offscreenWebgl.clear(this.offscreenWebgl.COLOR_BUFFER_BIT)
  }

  protected static webglToContext() {
    const { drawingBufferWidth: w, drawingBufferHeight: h, RGBA, UNSIGNED_BYTE } = this.offscreenWebgl
    const pixels = new Uint8ClampedArray(w * h * 4);

    this.offscreenWebgl.readPixels(0, 0, w, h, RGBA, UNSIGNED_BYTE, pixels);

    const imageData = new ImageData(w, h)
    imageData.data.set(pixels);

    this.offscreenCtx2D.putImageData(imageData, 0, 0)
  }

  constructor(spineName: string, premultipliedAlpha: boolean = false) {
    super()
    this.spineName = spineName
    this.premultipliedAlpha = premultipliedAlpha

    this.shader = spine.webgl.Shader.newTwoColoredTextured(SpineSprite.mangedGl);
    this.batcher = new spine.webgl.PolygonBatcher(SpineSprite.mangedGl);
    this.mvp = new spine.webgl.Matrix4();
    this.mvp.ortho2d(0, 0, Game.resolution.x - 1, Game.resolution.y - 1);
    this.skeletonRenderer = new spine.webgl.SkeletonRenderer(SpineSprite.mangedGl);
    this.assetManager = new spine.webgl.AssetManager(SpineSprite.mangedGl);

    this.shapes = new spine.webgl.ShapeRenderer(SpineSprite.mangedGl);

    this.assetManager.loadBinary("assets/" + spineName + ".skel");
    this.assetManager.loadTextureAtlas("assets/" + spineName + ".atlas");
  }

  protected _update(delta: number): void {
    super._update(delta)
    if (this.skeleton) {
      this.updateSkeleton(delta)
    } else {
      if (this.assetManager.isLoadingComplete() === false) return
      this.loadSkeleton();
      this.onLoad()
    }
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
        this.onAnimComplete()
        if (this.playingQueue === false) return
        this.playNextAnimation()
      },
      event: (track: spine.TrackEntry, event: spine.Event) => { this.onAnimEvent(event) }
    })

    this.playNextAnimation()
  }

  protected playNextAnimation() {
    if (this.state === undefined) return

    this.playingQueue = true

    const animationData = this.animationQueue[this.animationCount]

    if (this.currentAnimation !== animationData) {
      // 播放下一组动画
      this.currentAnimation = animationData
      if (animationData.delay > 0) {
        this.currentDelay = animationData.delay
        return
      }
    }

    this.speed = animationData.speed

    if (animationData.times < 0) {
      this.checkQueue()
      this.state.setAnimation(0, animationData.animationName, true)
    } else {
      animationData.times -= 1
      if (animationData.times === 0) this.checkQueue()
      this.state.setAnimation(0, animationData.animationName, false)
    }
  }

  protected checkQueue() {
    if (this.animationCount + 1 === this.animationQueue.length) {
      this.playingQueue = false
    } else {
      this.animationCount += 1
    }
  }

  protected updateSkeleton(delta: number) {
    if (this.state === undefined || this.skeleton === undefined) return
    this.skeleton.scaleX = this.scale.x * Game.canvas.scale
    this.skeleton.scaleY = -this.scale.y * Game.canvas.scale
    this.skeleton.x = this.position.x * Game.canvas.scale + this.skeleton.data.width * this.skeleton.scaleX
    this.skeleton.y = this.position.y * Game.canvas.scale + this.skeleton.data.height * -this.skeleton.scaleY

    this.state.update(delta * this.speed);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

    this.shader.bind();
    this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

    this.batcher.begin(this.shader);
    this.skeletonRenderer.premultipliedAlpha = this.premultipliedAlpha;
    this.skeletonRenderer.draw(this.batcher, this.skeleton);
    this.batcher.end();

    this.shader.unbind();
  }

  protected _render(delta: number): void {
    if (this.skeleton === undefined) return

    if (this.currentDelay > 0) {
      this.currentDelay -= delta
      if (this.currentDelay < 0) {
        this.currentDelay = 0
        this.playNextAnimation()
      }
    } else {
      if (this.playingQueue === false && this.animationCount + 1 < this.animationQueue.length) {
        this.playNextAnimation()
      }
    }

    const { x: dx, y: dy } = this.skeleton
    const { width: dw, height: dh } = this.skeleton.data
    const sx = this.position.x * Game.canvas.scale
    const sy = this.position.y * Game.canvas.scale
    Game.renderer.ctx.drawImage(SpineSprite.offscreenCanvas2D, sx, sy, dw, dh, dx, dy, dw, dh)
  }

  protected onLoad() { }

  protected onAnimStart() { }

  protected onAnimInterrupt() { }

  protected onAnimEnd() { }

  protected onAnimComplete() { }

  protected onAnimEvent(event: spine.Event) { }

  public addAnimation(animationName: string, options?: { speed?: number, times?: number, delay?: number }) {
    const speed = options?.speed || 1
    const times = options?.times || -1
    const delay = options?.delay || 0
    this.animationQueue.push({ animationName, times, speed, delay })
  }
}
