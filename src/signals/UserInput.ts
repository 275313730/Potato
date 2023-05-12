import Signal from "./Signal";
import UserInputEvent from "../variant_types/UserInputEvent";

class UserInput extends Signal {
  emit(userInputEvent: UserInputEvent): void {
    for (let fn of this.fns) {
      fn(userInputEvent)
    }
  }
}

export default UserInput