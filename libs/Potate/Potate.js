    export function potate() {
    let states = {}
    let currState = null
    const unit = this
    this.potate = {
        addState(state, action, condition) {
            states[state] = { action, condition }
        },
        setState(nextState) {
            if (currState != null) {
                if (states[currState].condition && !states[currState].condition(nextState)) {
                    return false
                }
            }
            currState = nextState
            states[currState].action && states[currState].action.call(unit)
            return true
        },
        getState() {
            return currState
        }
    }
}