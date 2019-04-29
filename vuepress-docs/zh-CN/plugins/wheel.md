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

只要传入以下的配置，就能实例化 BetterScroll。

```js
let bs = new BScroll('.bs-wrap', {
  wheel: true // wheel options 为 true
})

let wheel = bs.plugins.wheel // wheel 实例
```

:::tip
wheel options 是一个真值（Truthy）或者对象，否则插件功能失效。具体请参考[ wheel options 配置](./wheel.html#wheel-options-配置)。
:::

<demo qrcode-url="wheel/">
  <template slot="code-template">
    <<< @/example/vue/components/zoom/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/components/zoom/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/components/zoom/default.vue?style
  </template>
  <zoom-default slot="demo"></zoom-default>
</demo>

## wheel options 配置
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
