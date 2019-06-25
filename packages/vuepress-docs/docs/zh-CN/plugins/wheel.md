# wheel

## 介绍

wheel 插件，是实现类似 IOS Picker 组件的基石。

## 安装

```bash
npm install @better-scroll/wheel@next --save

// or

yarn add @better-scroll/wheel@next
```

## 使用

首先引入 wheel 插件，并通过全局方法 `BScroll.use()` 扩展 BetterScroll 的能力。

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)
```

只要传入以下的配置，bs 就扩展了 wheel 的能力。

```js
let bs = new BScroll('.bs-wrap', {
  wheel: true // wheel options 为 true
})

let wheel = bs.plugins.wheel // wheel 实例
```

:::tip
wheel options 是一个真值（Truthy）或者对象，否则插件功能失效，具体请参考[ wheel options](./wheel.html#wheel-options)。
:::

## 需知

BetterScroll 结合 Wheel 插件只是实现 Picker 效果的 JS 逻辑部分，还有 DOM 模版是需要用户去实现，所幸，对于大多数的 Picker 场景，我们给出了相对应的示例。

- **基本使用**

  <demo qrcode-url="picker/one-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/one-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/one-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/one-column.vue?style
    </template>
    <picker-one-column slot="demo"></picker-one-column>
  </demo>

  单列 Picker 是一个比较常见的效果。你可以通过 `selectedIndex` 来配置初始化选中对应索引的 item，`wheelDisabledItemClass` 配置想要禁用的 item 项来模拟 Web Select 标签 disable

- **多项选择器**

  <demo qrcode-url="picker/double-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/double-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/double-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/double-column.vue?style
    </template>
    <picker-double-column slot="demo"></picker-double-column>
  </demo>

  示例是一个两列的选择器，JS 逻辑部分与单列选择器没有多大的区别，你会发现这个两列选择器之间是没有任何关联，因为它们是两个不同的 BetterScroll 实例。如果你想要实现省市联动的效果，那么得加上一部分代码，让这两个 BetterScroll 实例能够关联起来。请看下一个例子：

- **城市联动选择器**

  <demo qrcode-url="picker/linkage-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/linkage-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/linkage-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/linkage-column.vue?style
    </template>
    <picker-linkage-column slot="demo"></picker-linkage-column>
  </demo>

  城市联动 Picker 的效果，必须通过 JS 部分逻辑将不同 BetterScroll 的实例联系起来，不管是省市，还是省市区的联动，亦是如此。

## wheel options

|名称|类型|描述|默认值|
|----------|:-----:|:-----------|:--------:|
|selectedIndex|number|初始化选中第几项|0|
|rotate|number|运用在 wheel item 上的 transform: rotate 样式|25|
|adjustTime|number|点击时矫正至正确索引项的时间|400|
|wheelWrapperClass|string|容器的样式|'wheel-scroll'|
|wheelItemClass|string|容器子元素 item 的样式|'wheel-item'|
|wheelDisabledItemClass|string|容器禁用子元素 item 的样式|'wheel-disabled-item'|

## API

### getSelectedIndex()

获取当前选中项的索引

**返回值**：当前选中项的索引

### wheelTo(index = 0, time = 0, ease?: EaseItem, isSlient?: boolean)

滚动至对应索引的 item

**参数**

|名称|类型|描述|
|----------|:-----:|:-----------|
|index|number|索引（下标从 0 开始）|
|time|number|动画的时长，单位为毫秒|
|ease|?:EaseItem|缓存函数，可在 `packages/shared-utils/src/ease` 查看，一般可不传|
|isSlient|?:boolean|一般为 false，如果为 true，那么在 time 为 0 的时候，是不会派发 scroll 和 scrollEnd 钩子|
