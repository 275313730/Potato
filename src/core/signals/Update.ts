import Signal from './Signal';

export default class Update extends Signal {
  connect(index: number, fn: (delta: number) => void): void {
    super.connect(index, fn);
  }

  emit(args: number): void {
    for (const connection of this.connections) {
      connection.fn(args);
    }
  }
}
