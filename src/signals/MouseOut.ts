import Signal from "./Signal";

class MouseOut extends Signal {
  emit(mouseEvent: MouseEvent): void {
    for (let fn of this.fns) {
      fn(mouseEvent)
    }
  }
}

export default MouseOut