abstract class Signal {
  fns: Function[] = []

  connect(fn: Function) {
    this.fns.push(fn)
  }

  disconnect(targetFn: Function) {
    for (let i = 0; i < this.fns.length - 1; i++) {
      let fn = this.fns[i]
      if (fn === targetFn) {
        this.fns.splice(i, 1)
      }
    }
  }

  abstract emit(...args: any): void
}

export default Signal