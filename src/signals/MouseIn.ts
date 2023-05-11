import Signal from "./Signal";

class MouseIn extends Signal {
  emit(mouseEvent: MouseEvent): void {
    console.log("mouseIn")
    for (let fn of this.fns) {
      fn(mouseEvent)
    }
  }
}

export default MouseIn