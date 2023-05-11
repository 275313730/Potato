import Signal from "./Signal";
import UserInputEvent from "../variant_types/UserInputEvent";

class UserInput extends Signal {
  emit(inputEvent: UserInputEvent): void {
    for (let fn of this.fns) {
      fn(inputEvent)
    }
  }
}

export default UserInput