let id = 100000

export default class SpriteSystem {
  static generateId(): number {
    return id++
  }
}

