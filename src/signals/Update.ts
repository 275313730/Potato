import Signal from "./Signal";

class Update extends Signal{
  emit(delta:number): void {
    for(let fn of this.fns){
      fn(delta)
    }
  }
}

export default Update