(function prototypeChange() {
    Array.prototype.delete = function (key, value, fn) {
        for (let i = 0; i < this.length; i++) {
            if (this[i][key] === value) {
                fn(this[i])
                this.splice(i, 1)
                i--
            }
        }
    }

    const canvasProto = CanvasRenderingContext2D.prototype,
        methods = Object.create(canvasProto)

    canvasProto.wrapText = function (text, x, y, maxWidth, lineHeight) {
        if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
        }

        const context = this;
        const canvas = context.canvas;

        if (typeof maxWidth == 'undefined') {
            maxWidth = (canvas && canvas.width) || 300;
        }
        if (typeof lineHeight == 'undefined') {
            lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
        }

        // 字符分隔为数组
        const arrText = text.split('');
        let line = '';

        for (let n = 0; n < arrText.length; n++) {
            const testLine = line + arrText[n];
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
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

    canvasProto.centerText = function (text, x, y) {
        this.fillText(text, x - this.measureText(text).width / 2, y)
    }

    canvasProto.centerRect = function (x, y, width, height) {
        this.fillRect(x - width / 2, y - height / 2, width, height)
    }
})()