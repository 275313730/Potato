let id = 100000

class SpriteSystem {
  static generateId(): number {
    return id++
  }
}

export default SpriteSystem