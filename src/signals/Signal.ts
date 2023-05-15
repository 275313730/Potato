class Signal {
  fns: Function[] = []

  connect(targetFn: Function) {
    for (let fn of this.fns) {
      if (fn === targetFn) return
    }
    this.fns.push(targetFn)
  }

  disconnect(targetFn: Function) {
    for (let i = 0; i < this.fns.length; i++) {
      let fn = this.fns[i]
      if (fn !== targetFn) continue
      this.fns.splice(i, 1)
      return
    }
  }

  emit(...args: any): void {
    for (let fn of this.fns) {
      fn(...args)
    }
  }
}

export default Signal