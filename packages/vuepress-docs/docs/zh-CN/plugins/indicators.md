# indicators <Badge text="2.1.5" />

## 介绍

indicators 赋予了联动另外一个 BetterScroll 的能力，借助于此，可以实现**视觉滚动差**、**放大镜**等效果。

::: tip 提示
这是一个非常强大并且具有创造力的插件，限制你的只有你的想象力！
:::

## 安装

```bash
npm install @better-scroll/indicators --save

// or

yarn add @better-scroll/indicators
```

## 使用

首先引入 indicators 插件，并通过静态方法 `BScroll.use()` 注册插件

```js
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'

BScroll.use(Indicators)
```

接着在 `options` 传入正确的配置。

```js
new BScroll('.wrapper', {
  indicators: {
    // 详情可以参考下面的 demo
    relationElement: "联动的元素 DOM"
  }
})
```
## 示例

  - **放大镜效果**

    <demo qrcode-url="indicators/minimap" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/indicators/minimap.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/minimap.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/minimap.vue?style
      </template>
      <indicators-minimap slot="demo"></indicators-minimap>
    </demo>

  - **视觉滚动差**

    <demo qrcode-url="indicators/parallax-scroll">
      <template slot="code-template">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?style
      </template>
      <indicators-parallax-scroll slot="demo"></indicators-parallax-scroll>
    </demo>

## indicators 选项对象

### relationElement

  - **类型**：`HTMLElement`

  与另外一个 BetterScroll 关联的容器元素，正如上面的 demo， `div.scroll-indicator` 就是 releationElement。**releationElement 必须由用户传入，并且拥有子元素**。

### relationElementHandleElementIndex

  - **类型**：`number`
  - **默认值**：`0`

  指定 releationElement 的第几个子元素作为操控的元素，详细可以参考以上的 demo。

### ratio

  - **类型**：`number | Ratio | undefined`
  - **默认值**：`undefined`

  ```ts
  type Ratio = {
    x: number // 指定 x 方向滚动距离的比例
    y: number // 指定 y 方向滚动距离的比例饿
  }
  ```
  指定 releationElement 与 BetterScroll 滚动距离的比例。一般情况下，**插件内部会自动计算**两者的滚动比例，但是你也可以手动指定比例，来实现 `视觉滚动差` 的效果。详细可以参考以上的 Demo。

### interactive

  - **类型**：`boolean | undefined`
  - **默认值**：`undefined`

  决定 relationElement 的第 relationElementHandleElementIndex 个子元素是否可以交互，当它置成 false 的时候，则不响应 touch / mouse 事件。