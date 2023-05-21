import Signal from './Signal';
import UserInputEvent from '../variant_types/UserInputEvent';

export default class UserInput extends Signal {
  emit(userInputEvent: UserInputEvent): void {
    for (const connection of this.connections) {
      connection.fn(userInputEvent);
    }
  }
}
