export default class Signal {
  connections: { index: number; fn: (args: any) => void }[] = [];

  connect(index: number, fn: (args?: any) => void) {
    for (const connection of this.connections) {
      if (connection.index === index) return;
    }
    this.connections.push({ index, fn });
  }

  disconnect(index: number) {
    for (let i = 0; i < this.connections.length; i++) {
      const connection = this.connections[i];
      if (connection.index !== index) continue;
      this.connections.splice(i, 1);
      return;
    }
  }

  emit(args?: any): void {
    for (const connection of this.connections) {
      connection.fn(args);
    }
  }
}
