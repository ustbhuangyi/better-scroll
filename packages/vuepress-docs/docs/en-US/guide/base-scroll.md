# base-scroll

In the design of BetterScroll 2.0, we abstracted the core scrolling part, which is the smallest unit of use of BetterScroll. The compression volume is nearly one-third smaller than `1.0`. You may only need to complete a pure scrolling, then just import this library as follows:

```shell
  npm install @better-scroll/core@next --save
```

```js
  import BScroll from '@better-scroll/core'
  const bs = new BScroll('.div')
```

## Get started

BetterScroll has a variety of scroll modes.

- **vertical scroll**

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
  BetterScroll dispatches the scroll event in real time, which requires setting `probeType` to 3.
  :::

- **Horizontal scroll**

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
  BetterScroll achieves horizontal scrolling, which is more demanding for CSS. First you need to make sure that the wrapper doesn't wrap, and the display of content is inline-block.

  ```stylus
  .scroll-wrapper
    // ...
    white-space nowrap
  .scroll-content
    // ...
    display inline-block
  ```
  :::

- **freeScroll（Horizontal and vertical scroll simultaneously）**

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

## Warm Tips

  :::tip
  **If there is any situation where scrolling is not possible, you should first check if the height/width of the content element is greater than the height/width of the wrapper**. This is a prerequisite for content to scroll.

  If the content has an image, it may happen that the image has not been downloaded when the DOM element is rendered, so the height of the content element is less than expected, and the scrolling is not normal. At this point you should call the `bs.refresh` method after the image has been loaded, such as the `onload` event callback, which will recalculate the latest scrolling distance.
  :::
