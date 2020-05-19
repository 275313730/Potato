window.addEventListener('wheel', e => {
    if (e.ctrlKey) {
        event.preventDefault()
        if (e.deltaY < 0) {
            Editor.zoomIn()
        } else if (e.deltaY > 0) {
            Editor.zoomOut()
        }
    }
})

class Editor {
    // 创建新地图
    static changeMap() {
        this.pixel = pixel.value
        this.setCanvas(mapColumn.value * pixel.value, mapRow.value * pixel.value)
        this.context.strokeRect(0, 0, this.pixel, this.pixel)
        this.drawPick()
    }

    // 上传地图
    static uploadMap(obj) {
        const img = new Image()
        img.onload = () => {
            this.pixel = pixel.value
            this.setCanvas(img.width, img.height)
            this.relContext.drawImage(img, 0, 0)
            this.context.drawImage(img, 0, 0)
            this.context.strokeRect(0, 0, this.pixel, this.pixel)
            this.drawPick()
        }
        img.src = this.getObjectURL(obj.files[0])
        let fileName = obj.files[0].name
        fileName = fileName.substring(0, fileName.indexOf('.'))
        document.querySelector('#mapName').value = fileName
    }

    // 设置画布属性
    static setCanvas(width, height) {
        this.canvas = document.querySelector('#app')
        this.context = this.canvas.getContext('2d')
        this.canvas.setAttribute('width', width)
        this.canvas.setAttribute('height', height)
        this.drawColumn = 0
        this.drawRow = 0
        if (this.relCanvas) { return }
        this.relCanvas = this.canvas.cloneNode()
        this.relContext = this.relCanvas.getContext('2d')
    }

    // 绘制区域选取
    static drawPick() {
        this.canvas.addEventListener('click', mouse => {
            const pixel = this.pixel
            const canvas = this.canvas
            const scale = canvas.getAttribute('width') / canvas.clientWidth
            const column = this.drawColumn = Math.floor((mouse.layerX - canvas.offsetLeft) / (pixel / scale))
            const row = this.drawRow = Math.floor((mouse.layerY - canvas.offsetTop) / (pixel / scale))
            const ctx = this.context
            const imgData = this.relContext.getImageData(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'))
            ctx.putImageData(imgData, 0, 0)
            ctx.strokeRect(column * pixel, row * pixel, pixel, pixel)
        })
    }

    // 上传素材
    static uploadAsset(obj) {
        const img = new Image()
        img.onload = () => {
            this.asset = img
            this.assetCanvas = document.querySelector('#asset')
            this.assetCanvas.setAttribute('width', img.width)
            this.assetCanvas.setAttribute('height', img.height)
            const ctx = this.assetContext = this.assetCanvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            ctx.strokeStyle = 'white'
            ctx.strokeRect(0, 0, this.pixel, this.pixel)
            this.assetPick()
            this.assetColumn = 0
            this.assetRow = 0

            window.addEventListener('keypress', e => {
                if (e.key === 'd') {
                    this.draw()
                } else if (e.key === 'a') {
                    this.clear()
                }
            })
        }
        img.src = this.getObjectURL(obj.files[0])

    }

    // 获取file的url
    static getObjectURL(file) {
        var url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    // 素材区域选取
    static assetPick() {
        this.assetCanvas.addEventListener('click', mouse => {
            const pixel = this.pixel
            const canvas = this.assetCanvas
            const scale = canvas.getAttribute('width') / canvas.clientWidth
            const column = this.assetColumn = Math.floor((mouse.layerX - canvas.offsetLeft) / (pixel / scale))
            const row = this.assetRow = Math.floor((mouse.layerY - canvas.offsetTop) / (pixel / scale))
            const ctx = this.assetContext
            ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'))
            ctx.drawImage(this.asset, 0, 0)
            ctx.strokeRect(column * pixel, row * pixel, pixel, pixel)
        })
    }

    // 绘制
    static draw() {
        const pixel = this.pixel
        this.relContext.drawImage(this.asset, this.assetColumn * pixel, this.assetRow * pixel, pixel, pixel, this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)
        this.copy()
    }

    // 擦除
    static clear() {
        const pixel = this.pixel
        this.relContext.clearRect(this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)
        this.copy()
    }

    // 放大
    static zoomIn() {
        this.zoom(5)
    }

    // 缩小
    static zoomOut() {
        this.zoom(-5)
    }

    static zoom(vary) {
        if (!this.style) {
            this.style = document.createElement('style');
            this.width = 45 + vary
            this.style.type = 'text/css';
            this.style.innerHTML = `#app{ width:${this.width}vw; }`;
            document.getElementsByTagName('HEAD').item(0).appendChild(this.style);
        } else {
            if (this.width <= 20 && vary < 0) { return }
            if (this.width >= 80 && vary > 0) { return }
            this.width += vary
            this.style.innerHTML = `#app{width:${this.width}vw;}`
        }
    }

    // 拷贝画布
    static copy() {
        const pixel = this.pixel
        const imgData = this.relContext.getImageData(0, 0, this.canvas.getAttribute('width'), this.canvas.getAttribute('height'))
        this.context.putImageData(imgData, 0, 0)
        this.context.strokeRect(this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)
    }

    // 保存画布为png格式的图片并下载
    static save() {
        const oA = document.createElement("a");
        oA.download = document.querySelector('#mapName').value + '.png';// 设置下载的文件名
        oA.href = this.relCanvas.toDataURL("image/png");
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    }
}