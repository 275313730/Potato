import AssetSystem from "../systems/AssetSystem";
import Sprite from "./Sprite";

class AudioSprite extends Sprite {
  audio: HTMLAudioElement

  setAudio(group: string, name: string) {
    this.audio = AssetSystem.getAsset(group, name)
  }

  /**
   * 播放音乐
   * @param {Object} options 
   */
  play(options?: { volume?: number, loop?: boolean }) {

    this.audio.volume = options?.volume || 1;
    this.audio.loop = options.loop;
    this.audio.play();
  }

  /**
   * 停止播放音乐
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  _render(): void {
    
  }
}

export default AudioSprite