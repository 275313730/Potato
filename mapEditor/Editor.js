class Editor {
    static init() {
        this.canvas = document.querySelector('#app')
        this.context = this.canvas.getContext('2d')
        this.drawPick()
    }

    // 创建新地图
    static createMap(node) {
        this.pixel = pixel.value
        this.canvas.setAttribute('width', mapColumn.value * pixel.value)
        this.canvas.setAttribute('height', mapRow.value * pixel.value)

        this.relCanvas = this.canvas.cloneNode()
        this.relContext = this.relCanvas.getContext('2d')

        this.drawPick()

        window.addEventListener('keypress', e => {
            if (e.key === 'd') {
                this.draw()
            } else if (e.key === 'c') {
                this.clear()
            }
        })

        node.parentNode.parentNode.removeChild(node.parentNode)
    }

    // 上传地图
    static uploadMap(obj) {
        const img = new Image()
        img.onload = () => {
            this.pixel = pixel.value
            this.canvas.setAttribute('width', img.width)
            this.canvas.setAttribute('height', img.height)

            this.relCanvas = this.canvas.cloneNode()
            this.relContext = this.relCanvas.getContext('2d')

            this.relContext.drawImage(img, 0, 0)

            const ctx = this.context
            ctx.drawImage(img, 0, 0)

            ctx.strokeRect(0, 0, this.pixel, this.pixel)

            this.drawPick()

            window.addEventListener('keypress', e => {
                if (e.key === 'd') {
                    this.draw()
                } else if (e.key === 'c') {
                    this.clear()
                }
            })

            obj.parentNode.parentNode.removeChild(obj.parentNode)
        }
        img.src = getObjectURL(obj.files[0])

        //建立一個可存取到該file的url
        function getObjectURL(file) {
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

            obj.parentNode.parentNode.removeChild(obj.parentNode)
        }
        img.src = getObjectURL(obj.files[0])

        //建立一個可存取到該file的url
        function getObjectURL(file) {
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

        const imgData = this.relContext.getImageData(0, 0, this.canvas.getAttribute('width'), this.canvas.getAttribute('height'))

        this.context.putImageData(imgData, 0, 0)

        this.context.strokeRect(this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)
    }

    // 擦除
    static clear() {
        const pixel = this.pixel
        this.relContext.clearRect(this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)

        const imgData = this.relContext.getImageData(0, 0, this.canvas.getAttribute('width'), this.canvas.getAttribute('height'))

        this.context.putImageData(imgData, 0, 0)

        this.context.strokeRect(this.drawColumn * pixel, this.drawRow * pixel, pixel, pixel)
    }

    // 保存画布
    static save() {

        downLoad(saveAsPNG(this.relCanvas), fileName.value);

        // 保存成png格式的图片
        function saveAsPNG(canvas) {
            return canvas.toDataURL("image/png");
        }

        // 下载
        function downLoad(url, name) {
            var oA = document.createElement("a");
            oA.download = name + '.png';// 设置下载的文件名，默认是'下载'
            oA.href = url;
            document.body.appendChild(oA);
            oA.click();
            oA.remove(); // 下载之后把创建的元素删除
        }
    }
}

Editor.init()



