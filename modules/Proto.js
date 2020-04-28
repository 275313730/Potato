(function () {
    "use strict"
    const canvasProto = CanvasRenderingContext2D.prototype

    // 文字换行(用于对话框文字等)
    canvasProto.wrapText = function (text, x, y, maxWidth, lineHeight) {
        if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
        }

        const canvas = this.canvas;

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
            const metrics = this.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        this.fillText(line, x, y);
    }

    // 中心绘制文字(用于标题等)
    canvasProto.centerText = function (text, x, y) {
        this.fillText(text, x - this.measureText(text).width / 2, y)
    }

    // 中心绘制形状(用于对话框等)
    canvasProto.centerRect = function (x, y, width, height) {
        this.fillRect(x - width / 2, y - height / 2, width, height)
    }

    // 水平翻转绘制
    canvasProto.drawFlip = function (width, callback) {
        this.translate(width, 0);
        this.scale(-1, 1);
        callback()
        this.translate(width, 0);
        this.scale(-1, 1);
    }

    canvasProto.test = function (x, y, width, height) {
        this.strokeStyle = 'red'
        this.strokeRect(x, y, width, height)
    }
})()