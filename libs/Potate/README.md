# Potate

  *   Potate是一个状态机自定义库，你可以使用Potate快速使用和管理自定义状态机。

# 用法

  1.  使用Game.mix混入Sprite
  2.  使用this.potate.addState(name,action,condition)添加状态，name指状态名，action指改变状态后执行的函数，condition指改变状态时需要满足的函数(通过返回布尔值判断)
  3.  使用this.potate.setState(name)改变当前状态
  4.  使用this.potate.getState()获取当前状态

# 示例

    ```javascript
        function test(){
            return{
                methods:{
                    stop(){
                        // ...code
                    },
                    walk(){
                        // ...code
                    },
                    jump(){
                        // ...code
                    },
                    attack(){
                        // ...code
                    }
                },
                created(){
                    this.potate.addState('stop', this.stop)
                    this.potate.addState('walk', this.walk)
                    this.potate.addState('jump', this.jump, nextState => {
                        if(nextState==='attack'){
                            return false
                        }
                    })
                    this.potate.addState('attack', this.attack, nextState => {
                        if(nextState==='jump'){
                            return false
                        }
                    })
                }
            }
        }
    ```