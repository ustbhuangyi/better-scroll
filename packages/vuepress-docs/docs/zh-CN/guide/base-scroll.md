# 核心滚动

在 BetterScroll 2.0 的设计当中，我们抽象了核心滚动部分，它作为 BetterScroll 的最小使用单元，压缩体积比 `1.0` 小了将近三分之一，往往你可能只需要完成一个纯粹的滚动需求，那么你只需要引入这一个库，方式如下：

```bash
  npm install @better-scroll/core --save
```

```js
  import BScroll from '@better-scroll/core'
  const bs = new BScroll('.div')
```

## 上手

BetterScroll 有多种滚动模式。

- **垂直滚动**

  <demo qrcode-url="core/default">
    <template slot="code-template">
      <<< @/examples/vue/components/core/default.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/core/default.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/core/default.vue?style
    </template>
    <core-default slot="demo"></core-default>
  </demo>

  :::warning
  BetterScroll 实时派发 scroll 事件，是需要设置 `probeType` 为 3。
  :::

- **水平滚动**

  <demo qrcode-url="core/horizontal">
    <template slot="code-template">
      <<< @/examples/vue/components/core/horizontal.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/core/horizontal.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/core/horizontal.vue?style
    </template>
    <core-horizontal slot="demo"></core-horizontal>
  </demo>

  :::warning
  BetterScroll 实现横向滚动，对 CSS 是比较苛刻的。首先你要保证 wrapper 不换行，并且 content 的 display 是 inline-block。

  ```stylus
  .scroll-wrapper
    // ...
    white-space nowrap
  .scroll-content
    // ...
    display inline-block
  ```
  :::

- **freeScroll（水平与垂直同时滚动）**

  <demo qrcode-url="core/freescroll">
    <template slot="code-template">
      <<< @/examples/vue/components/core/freescroll.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/core/freescroll.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/core/freescroll.vue?style
    </template>
    <core-freescroll slot="demo"></core-freescroll>
  </demo>

## 温馨提示

  :::tip
  **任何时候如果出现无法滚动的情况，都应该首先查看 content 元素高度/宽度是否大于 wrapper 的高度/宽度**。这是内容能够滚动的前提条件。

  如果内容存在图片的情况，可能会出现 DOM 元素渲染时图片还未下载，因此内容元素的高度小于预期，出现滚动不正常的情况。此时你应该在图片加载完成后，比如 onload 事件回调中，调用 `bs.refresh` 方法，它会重新计算最新的滚动距离。
  :::
