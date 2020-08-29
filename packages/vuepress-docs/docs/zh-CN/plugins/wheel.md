# wheel

## 介绍

wheel 插件，是实现类似 IOS Picker 组件的基石。

## 安装

```bash
npm install @better-scroll/wheel --save

// or

yarn add @better-scroll/wheel
```

## 使用

首先引入 wheel 插件，并通过静态方法 `BScroll.use()` 注册插件。

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)
```

接着在 `options` 传入正确的配置

```js
  let bs = new BScroll('.bs-wrapper', {
    wheel: true // wheel options 为 true
  })
```

:::tip
wheel options 是 true 或者对象，否则插件功能失效，具体请参考[ wheel options](./wheel.html#wheel-选项对象)。
:::

::: danger 危险
BetterScroll 结合 wheel 插件只是实现 Picker 效果的 JS 逻辑部分，还有 DOM 模版是需要用户去实现，所幸，对于大多数的 Picker 场景，我们给出了相对应的示例。
:::

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

  单列 Picker 是一个比较常见的效果。你可以通过 `selectedIndex` 来配置初始化时选中对应索引的 item，`wheelDisabledItemClass` 配置想要禁用的 item 项来模拟 Web Select 标签 disable 的效果。

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

## wheel 选项对象

### selectedIndex

  - **类型**：`number`
  - **默认值**：`0`

  实例化 Wheel，默认选中第 selectedIndex 项，索引从 0 开始。

### rotate

  - **类型**：`number`
  - **默认值**：`25`

  当滚动 wheel 时，wheel item 的弯曲程度。

### adjustTime

  - **类型**：`number`
  - **默认值**：`400`(ms)

  当点击某一项的时候，滚动过去的动画时长。

### wheelWrapperClass

  - **类型**：`string`
  - **默认值**：`wheel-scroll`

  滚动元素的 className，这里的「滚动元素」 指的就是 BetterScroll 的 content 元素。

### wheelItemClass

  - **类型**：`string`
  - **默认值**：`wheel-item`

  滚动元素的子元素的样式。

### wheelDisabledItemClass

  - **类型**：`string`
  - **默认值**：`wheel-disabled-item`

  滚动元素中想要禁用的子元素，类似于 `select` 元素中禁用的 `option` 效果。wheel 插件的内部根据 `wheelDisabledItemClass` 配置来判断是否将该项指定为 disabled 状态。

## 实例方法

### getSelectedIndex()

  - **返回值**：当前选中项的 index，下标从 0 开始

  获取当前选中项的索引。

### wheelTo(index = 0, time = 0, [ease])

  - **参数**：
    - `{ number } index`：选项索引
    - `{ number } time`：动画时长
    - `{ number } ease<可选>`：动画时长。缓动效果配置，参考 [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts)，默认是 `bounce` 效果

  滚动至对应索引的列表项。
