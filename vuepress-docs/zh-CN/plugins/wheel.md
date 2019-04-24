# wheel

## 介绍

wheel 插件，是实现类似 IOS Picker 组件的基石。

## 使用

首先引入 wheel 插件，并通过全局方法 `BScroll.use()` 使用

```js
import BScroll from 'BScroll'
import Wheel from 'BScroll/wheel'

BScroll.use(Wheel)
```

上面步骤完成后，就给 BetterScroll 注入了 Wheel 的能力，接着只要传入以下的配置，就能得到一个具备竖向滚动能力的 bs 实例。

```js
new BScroll('.bs-wrap', {
  wheel: true
})
```

以下是相关配置：
- wheel

  若没有这只该项，则插件不会生效。可以配置一个真值，比如 true，插件内部的实例化使用默认的配置对象，具体请参考[ wheel 配置](./wheel.html#wheel-配置)。

<demo qrcode-url="zoom/">
  <template slot="code-template">
    <<< @/example/vue/demo/zoom/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/demo/zoom/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/demo/zoom/default.vue?style
  </template>
  <zoom-default slot="demo"></zoom-default>
</demo>

## wheel 配置
|名称|类型|描述|默认值|例子|
|----------|:-----:|:-----------|:--------:|:-------|
|start|number|开始的缩放时的基础比例|-|start:1 // 开始缩放时当前尺寸为1|
|min|number|最小缩放比例|-|min:0.5|
|max|number|最大缩放比例|-|max:2|

## api

### zoomTo(scale, x, y)

将滚动体缩放到指定的大小。

**参数**

|名称|类型|描述|
|----------|:-----:|:-----------|
|scale|number|缩放大小|
|x|number|缩放原点的横坐标, 相对于整个文档的左边距|
|y|number|缩放原点的纵坐标, 相对于整个文档的上边距|

**返回值**：无

## 事件

### zoomStart
- 参数：无
- 触发时机：缩放开始时

### zoomEnd
- 参数：无
- 触发时机：缩放结束后
