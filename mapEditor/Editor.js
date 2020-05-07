class Editor {
    static init(width, height) {
        this.canvas = document.querySelector('#app')
        this.canvas.setAttribute('width', width)
        this.canvas.setAttribute('height', height)
        this.context = this.canvas.getContext('2d')
    }

    // 改变地图属性
    static changeMap() {
        this.pixel = pixel.value
        Editor.canvas.setAttribute('width', mapColumn.value * pixel.value)
        Editor.canvas.setAttribute('height', mapRow.value * pixel.value)
    }

    // 上传图片
    static changepic(obj) {
        //console.log(obj.files[0]);//这里可以获取上传文件的name
        var newsrc = getObjectURL(obj.files[0]);
        document.getElementById('show').src = newsrc;

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

    // 绘制
    static draw() {
        const pixel = this.pixel
        this.context.drawImage(show, (imageColumn.value - 1) * pixel, (imageRow.value - 1) * pixel, pixel, pixel, (drawColumn.value - 1) * pixel, (drawRow.value - 1) * pixel, pixel, pixel)
    }

    // 保存画布
    static save() {
        downLoad(saveAsPNG(this.canvas), fileName.value);

        // 保存成png格式的图片
        function saveAsPNG(canvas) {
            return canvas.toDataURL("image/png");
        }

        // 保存成jpg格式的图片
        function saveAsJPG(canvas) {
            return canvas.toDataURL("image/jpeg");
        }

        // 保存成bmp格式的图片  目前浏览器支持性不好
        function saveAsBMP(canvas) {
            return canvas.toDataURL("image/bmp");
        }

        function downLoad(url, name) {
            var oA = document.createElement("a");
            oA.download = name;// 设置下载的文件名，默认是'下载'
            oA.href = url;
            document.body.appendChild(oA);
            oA.click();
            oA.remove(); // 下载之后把创建的元素删除
        }
    }
}



