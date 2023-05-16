import Game from "../Index";
import AssetSystem from "../game/AssetSystem";
import Sprite from "./Sprite";

export default class AudioSprite extends Sprite {
  protected waitPlay: boolean = false
  protected audio: HTMLAudioElement
  public playing: boolean = false
  public volume: number = 1

  public set loop(value: boolean) {
    this.audio.loop = value
  }

  public get loop() {
    return this.audio.loop
  }

  public range: number = 0

  setAudio(path: string) {
    this.audio = AssetSystem.loadAudio(path)
  }

  protected _update(delta: number): void {
    if (this.waitPlay && Game.start) this.play()
    super._update(delta)
    if (this.range > 0) {
      const { x, y } = Game.camera.position
      const distance = Math.sqrt(x * x + y * y)
      if (distance >= this.range) {
        this.audio.volume = 0
      } else {
        this.audio.volume = (1 - distance / this.range) * this.volume
      }
    } else {
      this.audio.volume = this.volume
    }
  }

  protected _pause(): void {
    if (this.playing) this.audio.pause()
  }

  protected _resume(): void {
    super._resume()
    if (this.playing) this.play()
  }

  /**
   * 播放音乐
   */
  public play() {
    if (Game.start) {
      this.audio.play()
      this.playing = true
      this.waitPlay = false
    } else {
      this.waitPlay = true
    }
  }

  public pause() {
    this.playing = false
    this.audio.pause();
  }

  /**
   * 停止播放音乐
   */
  stop() {
    this.pause()
    this.audio.currentTime = 0;
  }
}
