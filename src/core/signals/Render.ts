import Signal from './Signal';

export default class Render extends Signal {
  emit(delta: number): void {
    for (const connection of this.connections) {
      connection.fn(delta);
    }
  }
}
