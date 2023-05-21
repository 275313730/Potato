import Game, { Sprites, Components, Enums } from "./src/Index";

(async () => {
  Game.generate("potato")
  Game.resolution = { x: 1920, y: 1080 }

  class Obstacle extends Sprites.TextureSprite {
    protected label: Sprites.LabelSprite = new Sprites.LabelSprite()

    public onReady(): void {
      this.registerComponent(new Components.Collision())
      this.label.content = "↓这是一个带有碰撞体组件的精灵↓"
    }

    protected onTextureLoad(): void {
      this.label.position = { x: this.position.x + 70, y: this.position.y - 50 }
    }
  }

  const bg1 = new Obstacle()
  bg1.setTexture("bg.png")
  bg1.position = { x: 1000, y: 0 }
  bg1.scale = { x: 0.2, y: 0.2 }

  const bg2 = new Obstacle()
  bg2.setTexture("bg.png")
  bg2.scale = { x: 0.2, y: 0.2 }
  bg2.flipV = true
  bg2.flipH = true

  class Role extends Sprites.AnimationSprite {
    protected speed = 100
    protected moving = true
    protected collision: Components.Collision = new Components.Collision({ x: 15, y: 15 }, Enums.AnchorPoint.CENTER)

    public onReady(): void {
      this.registerComponent(this.collision)

      this.mouseIn.connect(this.id, () => {
        this.moving = false
      })
      this.mouseOut.connect(this.id, () => {
        this.moving = true
      })
    }

    public onUpdate(delta: number): void {
      if (!this.moving) return
      const nextPostion = { x: this.position.x + delta * this.speed, y: this.position.y }
      if (this.collision.checkCollide(nextPostion)) {
        this.speed = -this.speed
        this.flipH = !this.flipH
      } else {
        this.position.x = nextPostion.x
      }
    }
  }

  const girl = new Role()
  girl.setTexture("animation.png", 2, 6)
  girl.expandMode = Enums.ExpandMode.IGNORE_SIZE
  girl.size = { x: 100, y: 100 }
  girl.position = { x: 700, y: 0 }

  const girlLabel = new Sprites.LabelSprite()
  girlLabel.size.x = 150
  girlLabel.content = "将鼠标移动到她身上就会停止移动"
  girlLabel.fontWeight = Enums.FontWeight.BOLD
  girlLabel.onUpdate = function () {
    if (girlLabel.parent === null) return
    const { position, size, scale } = girlLabel.parent
    girlLabel.position.x = position.x - size.x / 2
  }

  girl.addChild(girlLabel)

  const label = new Sprites.LabelSprite()
  label.content = "这是一个绝对定位的LabelSprite"
  label.fontStyle = Enums.FontStyle.ITALY
  label.position = { x: 100, y: 100 }
  label.fontColor = { r: 255, g: 255, b: 200, a: 1 }
  label.locateMode = Enums.LocateMode.ABSOLUTE

  const lineEditSprite = new Sprites.LineEditSprite()
  lineEditSprite.size = { x: 200, y: 100 }
  lineEditSprite.scale = { x: 2, y: 2 }
  lineEditSprite.position = { x: 150, y: 150 }
  lineEditSprite.locateMode = Enums.LocateMode.ABSOLUTE

  const richTextLabelSprite = new Sprites.RichTextLabelSprite()
  richTextLabelSprite.position = { x: 700, y: -100 }
  richTextLabelSprite.size = { x: 200, y: 100 }
  richTextLabelSprite.content = "[p color='white']test[/p]"

  Game.camera.followSprite(girl, Enums.AnchorPoint.CENTER)
})()

