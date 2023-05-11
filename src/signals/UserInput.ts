import Signal from "../variant_types/Signal";

class UserInput extends Signal {
  emit(mouse_event: MouseEvent): void {
    for (let fn of this.fns) {
      fn(mouse_event)
    }
  }
}

export default UserInput