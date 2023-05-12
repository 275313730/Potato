import Signal from "./Signal";

class UserInput extends Signal {
  emit(event: Event): void {
    for (let fn of this.fns) {
      fn(event)
    }
  }
}

export default UserInput