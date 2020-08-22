import Game from "../Game/index.js"

export default function audio(sprite) {
  let music = {};
  let sounds = [];

  /**
   * 获取单位和镜头的距离
   * @returns 距离
   */
  function getDistance() {
    const relX = sprite.relX;
    const relY = sprite.relY;
    return Math.sqrt(relX ** 2 + relY ** 2);
  }

  /**
   * 播放音效
   * @param {AudioNode} newAudio 
   * @param {Object} options 
   */
  function playSound(newAudio, options) {
    const newSound = newAudio.cloneNode();

    newSound.volume = options.volume;
    newSound.play();

    sounds.push({
      audio: newSound,
      defalutVolume: options.volume,
      range: options.range
    });
  }

  /**
   * 播放音乐
   * @param {AudioNode} newAudio 
   * @param {Object} options 
   */
  function playMusic(newAudio, options) {
    if (!music.audio || music.audio !== newAudio) {
      music.audio = newAudio;
      music.defalutVolume = options.volume;
      music.range = options.range;

      newAudio.volume = options.volume;
      newAudio.loop = options.loop;
    }
    newAudio.play();
  }

  /**
   * 设置音量
   * @param {AudioNode} audio 
   * @param {number} range 
   * @param {number} defalutVolume 
   * @param {number} distance 
   */
  function setVolume(audio, range, defalutVolume) {
    const distance = getDistance()
    if (!range) return;
    if (distance >= range) {
      audio.volume = 0;
    } else {
      audio.volume = defalutVolume * ((range - distance) / range);
    }
  }

  return {
    /**
     * 更新音频
     */
    update() {
      // 判断是否存在音频
      if (!music.audio && sounds.length === 0) return;

      // 音乐
      if (music.audio && music.range > 0) {
        setVolume(music.audio, music.range, music.defalutVolume);
      }

      // 音效
      for (let i = 0; i < sounds.length; i++) {
        const sound = sounds[i];
        const audio = sound.audio;
        // 移除播放完的音效
        if (audio.ended === true) {
          sounds.splice(i, 1);
          audio.remove();
          i--;
          continue;
        }
        if (range > 0) {
          setVolume(sound.audio, sound.range, sound.defalutVolume);
        }
      }
    },
    /**
     * 播放音频
     * @param {Object} options 
     */
    play(options) {
      const type = options.type;
      const group = options.group;
      const name = options.name;
      const newAudio = Game.asset.get(group, name);

      if (!type) throw Error("Audio type is missing.");

      // 当类型为音效时，克隆一个独立节点来播放
      // 当类型为音乐时，默认循环播放
      if (type === 'sound') {
        playSound(newAudio, options);
      }
      if (type === 'music') {
        playMusic(newAudio, options)
      }
    },
    /**
     * 停止播放音乐
     */
    stop() {
      music.pause();
      music.currentTime = 0;
    },
    /**
     * 清除所有音频
     */
    clear() {
      if (music.audio) {
        music.audio.remove();
      }
      sounds.forEach(function (sound) {
        sound.audio.remove();
      })
    }
  }
}