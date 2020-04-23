# CanvasGame

    CanvasGame是一个用js和canvas来制作游戏的框架,源码中包含了一个示例游戏

# 框架思想

## 基于Sprite

    -基于Sprite的思想使得这个框架的操作几乎都是在Sprite上实现的(Stage本质上也是基于Sprite的，只是它的操作层级比Sprite高)，这样做的好处是你修改数据时只需要修改Sprite和调用它的Stage即可。
    -基于Sprite的好处是可以让游戏的内容和逻辑自然地分配到Sprite中，例如player和npc必定是分开在两个Sprite中的，因为它们的内容和逻辑并不相同。

## 组件化

    -组件化是这个框架的核心思想。组件化使场景和单位成为组件，从而达到可高度复用的效果，调用组件时根据不同数据即可创建不同的实例。
    -组件化的另一个目的是解耦。解耦即让各组件只处理自身的数据，而不干涉其他组件的数据，例如一个单位只改变自身的数据，而不改变另一个单位的数据。

## 简易化

    -这个框架的原始目的是把一些js函数和canvas函数封装起来，使游戏开发变得简单易懂。
    -在简易化的同时避免过度封装导致遇到问题时难以解决，也是这个框架的一个思考点。


# 示例游戏

## 图片和动画
    
    -展示了图片和动画的方法及效果

## 音乐和音效

    -展示了音乐和音效的方法及效果

## 复用场景

    -示例中的Forest是一个复用场景，通过编号来决定是否添加npc

## 玩家行为
    
    -示例展示了如何通过玩家行为创建单位和删除单位

## 场景跳转

    -示例编写了一些函数来校正场景跳转后的位置

## 对话框

    -示例展示了对话框的打字效果和分段对话效果

# 游戏资源

    美术资源来源于作者ansimuz,CC0协议
    音乐资源来源未知
