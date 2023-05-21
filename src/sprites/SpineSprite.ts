import Sprite from "./Sprite";
import Spine from "../packages/spine-ts/spine-canvas"
import Game from "../Index";

export default class SpineSprite extends Sprite {
  protected skelName: string;
  protected animName: string;
  protected fileType: string;

  protected assetManager: Spine.canvas.AssetManager;
  protected skeleton: Spine.Skeleton | undefined;
  protected state: Spine.AnimationState | undefined;
  protected bounds: { offset: Spine.Vector2; size: Spine.Vector2; } | undefined;
  protected skeletonRenderer: Spine.canvas.SkeletonRenderer

  protected loadStatus: boolean = false

  constructor(skelName: string, animName: string, fileType: string = "json") {
    super();
    this.skelName = skelName
    this.animName = animName
    this.fileType = fileType

    this.skeletonRenderer = new Spine.canvas.SkeletonRenderer(Game.render.context);

    this.assetManager = new Spine.canvas.AssetManager("assets/")

    if (fileType === "json") {
      this.assetManager.loadText(skelName + "." + fileType);
    } else {
      this.assetManager.loadBinary(skelName + "." + fileType);
    }
    this.assetManager.loadTexture(skelName.replace("-pro", "").replace("-ess", "") + ".png");
    this.assetManager.loadTextureAtlas(skelName.replace("-pro", "").replace("-ess", "") + ".atlas");
  }

  protected _update(delta: number): void {
    super._update(delta)
    if (this.loadStatus) return
    if (!this.assetManager.isLoadingComplete()) return
    this.loadStatus = true
    this.loadSkeleton("default")
  }

  protected loadSkeleton(skin: string) {
    const atlas = this.assetManager.get(this.skelName.replace("-pro", "").replace("-ess", "") + ".atlas")
    const atlasLoader = new Spine.AtlasAttachmentLoader(atlas);

    const skeletonLoader = this.fileType === "json" ? new Spine.SkeletonJson(atlasLoader) : new Spine.SkeletonBinary(atlasLoader);
    const skeletonObject = this.assetManager.get(this.skelName + "." + this.fileType)

    const skeletonData = skeletonLoader.readSkeletonData(skeletonObject);
    const skeleton = new Spine.Skeleton(skeletonData);

    skeleton.scaleY = -1;
    skeleton.setSkinByName(skin);
    const bounds = calculateBounds(skeleton);

    const state = new Spine.AnimationState(new Spine.AnimationStateData(skeleton.data));
    state.setAnimation(0, this.animName, true);
    state.addListener({
      event: (entry: Spine.TrackEntry, event: Spine.Event) => {
        return
      },
      complete: (entry: Spine.TrackEntry): void => {
        return
      },
      start: (entry: Spine.TrackEntry): void => {

        return
      },
      end: (entry: Spine.TrackEntry): void => {
        return
      },
      interrupt: (entry: Spine.TrackEntry): void => {
        return
      },
      dispose: (entry: Spine.TrackEntry): void => {
        return
      }
    })

    this.skeleton = skeleton;
    this.state = state;
    this.bounds = bounds;

    this.loadStatus = true
  }

  protected _render(delta: number): void {
    if (!this.loadStatus) return
    if (!this.state || !this.skeleton) return
    this.state.update(delta);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();
    this.skeleton.x = 500
    this.skeleton.y = 300
    this.skeleton.scaleX = this.scale.x
    this.skeleton.scaleY = -this.scale.y
    this.skeletonRenderer.draw(this.skeleton);
  }
}

function calculateBounds(skeleton: Spine.Skeleton) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();
  var offset = new Spine.Vector2();
  var size = new Spine.Vector2();
  skeleton.getBounds(offset, size, []);
  return { offset: offset, size: size };
}