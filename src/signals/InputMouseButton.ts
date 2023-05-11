import UserInput from "./UserInput";

class InputMouseButton extends UserInput {
  emit(mouse_event:MouseEvent): void {
    throw new Error("Method not implemented.");
  }

}

export default InputMouseButton