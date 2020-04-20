class Game {
    constructor(options) {
        Game.canvas = document.getElementById(options.el);
        Game.ctx = Game.canvas.getContext('2d');
        Game.width = options.width
        Game.height = options.height
        Game.currStage = null
        Game.animations = {}
        Game.images = {}
        Game.audio = {}
        this.promises = []
        this.changeMethods()
    }

    changeMethods() {
        CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
            if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
                return;
            }

            var context = this;
            var canvas = context.canvas;

            if (typeof maxWidth == 'undefined') {
                maxWidth = (canvas && canvas.width) || 300;
            }
            if (typeof lineHeight == 'undefined') {
                lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
            }

            // 字符分隔为数组
            var arrText = text.split('');
            var line = '';

            for (var n = 0; n < arrText.length; n++) {
                var testLine = line + arrText[n];
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = arrText[n];
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
        }
    }

    // 设置初始内容
    set(fn) {
        fn.call(this)
        return this
    }

    // 载入Stage
    start(stage, ...args) {
        Game.canvas.setAttribute('width', Game.width)
        Game.canvas.setAttribute('height', Game.height)

        Game.cutscenes()
        Promise.all(this.promises)
            .then(() => {
                Game.currStage = stage(args)
            })
            .catch(err => console.log(err))
    }

    loadImages(images) {
        images.forEach(image => {
            let img = Game.images[image.id] = new Image()
            this.promises.push(
                new Promise((resolve, reject) => {
                    img.onload = () => {
                        if (img.fileSize > 0 || (img.width > 0 && img.height > 0)) {
                            resolve('load')
                        } else {
                            reject(image.src)
                        }
                    }
                })
            )
            img.src = image.url
        })
        return this
    }

    loadAnimation(id, ...args) {
        Game.animations[id] = {}
        args.forEach(arg => {
            let images = Game.animations[id][arg.name] = []
            arg.type = arg.type || 'png'
            for (let i = 0; i < arg.length; i++) {
                images[i] = new Image()
                this.promises.push(
                    new Promise((resolve, reject) => {
                        images[i].onload = () => {
                            if (images[i].fileSize > 0 || (images[i].width > 0 && images[i].height > 0)) {
                                resolve('load')
                            } else {
                                reject(images[i].src)
                            }
                        }
                    })
                )
                images[i].src = `${arg.url}${i + 1}.${arg.type}`
            }
        })
        return this
    }

    loadAudio(audio) {
        Game.audio[audio.id] = new Audio(audio.url)
        return this
    }

    static cutscenes() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    static switchStage(stage, ...args) {
        this.currStage.destory()
        setTimeout(() => {
            this.cutscenes()
        })
        this.currStage = stage(args)
    }
}