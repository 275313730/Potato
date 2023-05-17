export default class Signal {
  connections: { index: number, fn: Function }[] = []

  connect(index: number, fn: Function) {
    for (let connection of this.connections) {
      if (connection.index === index) return
    }
    this.connections.push({ index, fn })
  }

  disconnect(index: number) {
    for (let i = 0; i < this.connections.length; i++) {
      let connection = this.connections[i]
      if (connection.index !== index) continue
      this.connections.splice(i, 1)
      return
    }
  }

  emit(...args: any): void {
    for (let connection of this.connections) {
      connection.fn(...args)
    }
  }
}