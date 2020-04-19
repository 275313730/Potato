class Game {
    constructor(options) {
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.stages = options.stages

        return this
    }
    
    start(name) {
        Game.currStage = Game.stages[name]()
        return this
    }

    static jump(name) {
        Game.currStage.destory()
        Game.currStage = Game.stages[name]()
    }
}