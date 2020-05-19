Pox是一个用于Sprite组件间通信的库，Sprite组件通过this.pox.xxx可以监听，获取和修改共用数据，从而进行通信。
Pox与场景事件的区别：
 * Pox是通过所有Sprite组件监听同一个数据来达到组件间通信的效果，即一个数据对应多个组件
 * 场景事件是通过比较组件的数据来进行处理多个组件数据，即多个数据对应一个组件或多个组件