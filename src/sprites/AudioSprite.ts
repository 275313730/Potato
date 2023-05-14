import AssetSystem from "../systems/AssetSystem";
import Sprite from "./Sprite";

export default class AudioSprite extends Sprite {
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
