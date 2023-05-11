import AssetSystem from "../systems/AssetSystem";
import UserInputEvent from "../variant_types/UserInputEvent";
import Sprite from "./Sprite";

class AudioSprite extends Sprite {
  protected _render(): void { }
  protected onReady(): void { }
  protected onUpdate(delta: number): void { }
  protected onInput(event: UserInputEvent): void { }
  protected onDestroy(): void { }

  audio: HTMLAudioElement

  setAudio(group: string, name: string) {
    this.audio = AssetSystem.getAsset(group, name)
  }

  /**
   * 播放音乐
   * @param {number} volume
   * @param {boolean} loop
   */
  play(volume: number, loop: boolean) {

    this.audio.volume = volume;
    this.audio.loop = loop;
    this.audio.play();
  }

  /**
   * 停止播放音乐
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

export default AudioSprite