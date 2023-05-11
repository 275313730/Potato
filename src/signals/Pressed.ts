import Signal from "./Signal";

class Pressed extends Signal {
  emit(): void {
    for (let fn of this.fns) {
      fn()
    }
  }
}

export default Pressed